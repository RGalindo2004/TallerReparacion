const express = require('express');
const router = express.Router();
const conexion = require('./database/db');
const session = require('express-session');


router.use(session({
    secret: 'mi_secreto_super_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

router.get('/', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    const query = 'SELECT * FROM usuario WHERE correoelectronico = ? AND estado = "ACT"';
    conexion.query(query, [correo], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.render('login', { error: 'Error en la base de datos' });
        }

        if (resultado.length > 0) {
            const usuario = resultado[0];

            if (usuario.contrasena === contrasena) {
          
                req.session.tipoUsuario = usuario.tipo;
                req.session.correo = usuario.correoelectronico;

                return res.redirect('/menu');
            } else {
                return res.render('login', { error: 'Usuario o contraseña incorrectos' });
            }
        } else {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
    });
});


router.get('/menu', (req, res) => {
    if (!req.session.tipoUsuario) {
        return res.redirect('/'); 
    }

    // Renderizar el menú y pasar el tipo de usuario a la vista
    res.render('index', { tipoUsuario: req.session.tipoUsuario });
});

router.get('/logout', (req, res) => {
    res.redirect('/');
});

const metodos = require('./controllers/me');

router.get('/usuarios', (req, res) => {
    // Verificar si el usuario tiene una sesión activa
    if (!req.session || !req.session.tipoUsuario) {
        return res.redirect('/'); // Redirigir al login si no está autenticado
    }

    // Verificar los permisos según el tipo de usuario
    if (req.session.tipoUsuario !== 'Administrador' && req.session.tipoUsuario !== 'Supervisor') {
        return res.status(403).send('Acceso denegado. No tienes permiso para ver esta página.');
    }

    // Si el usuario es administrador o supervisor, realizar la consulta
    conexion.query("SELECT * FROM usuario WHERE estado = 'ACT'", (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Ocurrió un error en la base de datos.');
        }

        // Renderizar la vista y pasar `tipoUsuario`
        res.render('usuario/index', { usuario: resultado, tipoUsuario: req.session.tipoUsuario });
    });
});

//REPORTES
router.get('/reportes', (req, res) => {
    res.render('reportes/index');  
});
// Rutas para los reportes
router.get('/reportes/asignacion_tecnico', metodos.reporteAsignacionTecnico);
router.get('/reportes/equipos_estado', metodos.reporteEquiposEstado);
router.get('/reportes/equipos_marca', metodos.reporteEquiposMarca);
router.get('/reportes/usuario_estado', metodos.reporteUsuariosEstado);
router.get('/reportes/equipos_tipo', metodos.reporteEquiposTipo);
router.get('/reportes/estado_reparacion', metodos.reporteEstadoReparacion);
///


router.get('/usuariosdes', (req, res) => {
    conexion.query("SELECT * FROM usuario WHERE estado = 'INA'", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('usuario/indexdes', { usuario: resultado });
    });
});

router.get('/crearusuario', (req, res) => {
    conexion.query('SELECT * FROM usuario', (error, resultadoUsuario) => {
        if (error) {
            console.log(error);
            return;
        }

        conexion.query('SELECT * FROM tipo_usuario', (error, resultadoTipo) => {
            if (error) {
                console.log(error);
                return;
            }

            res.render('usuario/crear', { usuario: resultadoUsuario, tipos: resultadoTipo });
        });
    });
});
router.post('/saveusuario', metodos.saveusuario);

router.get('/desactivarusuario/:id', (req, res) => {
    const codigo = req.params.id;
    conexion.query('SELECT * FROM usuario WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('usuario/desactivar', { usuario: resultado[0] });
    });
});
router.post('/disableusuario', metodos.disableusuario);

router.get('/activarusuario/:id', (req, res) => {
    const codigo = req.params.id;
    conexion.query('SELECT * FROM usuario WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('usuario/activar', { usuario: resultado[0] });
    });
});
router.post('/enableusuario', metodos.enableusuario);

router.get('/editarusuario/:id', (req, res) => {
    const codigo = req.params.id;
    conexion.query('SELECT * FROM usuario WHERE codigo = ?', [codigo], (error, resultadoUsuario) => {
        if (error) {
            console.error('Error en la consulta de usuario:', error);
            res.status(500).send('Error en la consulta de usuario');
            return;
        }

        conexion.query('SELECT * FROM tipo_usuario', (error, resultadoTipo) => {
            if (error) {
                console.error('Error en la consulta de tipos de usuario:', error);
                res.status(500).send('Error en la consulta de tipos de usuario');
                return;
            }
            res.render('usuario/editar', { usuario: resultadoUsuario[0], tipos: resultadoTipo });
        });
    });
});
router.post('/editusuario', metodos.editusuario);


router.get('/verusuario/:id', (req, res) => {
    const codigo = req.params.id;
    conexion.query('SELECT * FROM usuario WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('usuario/ver', { usuario: resultado[0] });
    });
});

//EQUIPOS
router.get('/equipos', (req, res) => {
    if (!req.session || !req.session.tipoUsuario) {
        return res.redirect('/'); // Redirigir al login si no hay sesión activa
    }

    const tipoUsuario = req.session.tipoUsuario;
    const correoUsuario = req.session.correo; // Obtener el correo electrónico del usuario autenticado

    let query = '';
    let params = [];

    if (tipoUsuario === 'Usuario_Final') {
        // Mostrar solo los equipos que pertenecen al usuario
        query = `
            SELECT equipo.codigo, equipo.numero_serie, equipo.marca, equipo.modelo, equipo.descripcion, equipo.estado, equipo.tipo_equipo, 
                   CONCAT(usuario.nombre, ' ', usuario.apellido) AS nombre_usuario
            FROM equipo
            JOIN usuario ON usuario.codigo = equipo.usuario
            WHERE usuario.correoelectronico = ? AND usuario.estado = 'ACT'
        `;
        params = [correoUsuario];
    } else {
        // Mostrar todos los equipos para otros tipos de usuarios
        query = `
            SELECT equipo.codigo, equipo.numero_serie, equipo.marca, equipo.modelo, equipo.descripcion, equipo.estado, equipo.tipo_equipo, 
                   CONCAT(usuario.nombre, ' ', usuario.apellido) AS nombre_usuario
            FROM equipo
            JOIN usuario ON usuario.codigo = equipo.usuario
            WHERE usuario.estado = 'ACT'
        `;
    }

    conexion.query(query, params, (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Ocurrió un error en la base de datos.');
        }

        res.render('equipo/index', { equipo: resultado, tipoUsuario });
    });
});

router.get('/crearequipo', (req, res) => {
    conexion.query('SELECT * FROM equipo', (error, resultadoEquipo) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error en la base de datos");
        }

        conexion.query('SELECT * FROM tipo_equipo', (error, resultadoTipos) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Error en la base de datos");
            }

            conexion.query('SELECT * FROM marca', (error, resultadoMarcas) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Error en la base de datos");
                }

                
                conexion.query('SELECT * FROM usuario WHERE tipo = "cliente"', (error, resultadoUsuario) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send("Error en la base de datos");
                    }

                    // Renderizar la vista con los datos filtrados
                    res.render('equipo/crear', { 
                        equipo: resultadoEquipo[0], 
                        tipos: resultadoTipos, 
                        marcas: resultadoMarcas, 
                        usuario: resultadoUsuario
                    });
                });

            });

        });
    });
});

router.post('/saveequipo', metodos.saveequipo);

//EDITAR EQUIPO 
router.get('/actualizarequipo/:id', (req, res) => {
    const codigo = req.params.id;
    conexion.query('SELECT * FROM equipo WHERE codigo = ?', [codigo], (error, resultadoEquipo) => {
        if (error) {
            console.log(error);
            return;
        }

        conexion.query('SELECT * FROM tipo_equipo', (error, resultadoTipos) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Error en la base de datos");
            }

            conexion.query('SELECT * FROM marca', (error, resultadoMarcas) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Error en la base de datos");
                }

                res.render('equipo/actualizar', { equipo: resultadoEquipo[0], tipos: resultadoTipos, marcas: resultadoMarcas });
            });
        });
    });
});

router.post('/actualizarequipo', metodos.actualizarequipo);

router.get('/descartarequipo/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM equipo WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('equipo/descartar', { equipo: resultado[0] });
    });
});
router.post('/deleteequipo', metodos.deleteequipo);

//TIPOS DE EQUIPOS
router.get('/tipo_equipo', (req, res) => {
    conexion.query("SELECT * FROM tipo_equipo", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('tipo_equipo/index', { tipo_equipo: resultado });
    });
});

router.get('/creartipoequipo', (req, res) => {
    res.render('tipo_equipo/crear');
});

router.post('/savetipoequipo', metodos.savetipoequipo);

router.get('/eliminartipoequipo/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM tipo_equipo WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('tipo_equipo/eliminar', { tipo_equipo: resultado[0] });
    });
});
router.post('/deletetipoequipo', metodos.deletetipoequipo);

router.get('/editartipoequipo/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM tipo_equipo WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('tipo_equipo/editar', { tipo_equipo: resultado[0] });
    });
});
router.post('/edittipoequipo', metodos.edittipoequipo);

//MARCA DE EQUIPOS
router.get('/marca', (req, res) => {
    conexion.query("SELECT * FROM marca", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('marca/index', { marca: resultado });
    });
});

router.get('/crearmarca', (req, res) => {
    res.render('marca/crear');
});

router.post('/savemarca', metodos.savemarca);

router.get('/eliminarmarca/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM marca WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('marca/eliminar', { marca: resultado[0] });
    });
});
router.post('/deletemarca', metodos.deletemarca);

router.get('/editarmarca/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM marca WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('marca/editar', { marca: resultado[0] });
    });
});
router.post('/editmarca', metodos.editmarca);

//ASIGNACIÓN DE EQUIPOS
router.get('/asignacion_equipo', (req, res) => {
    if (!req.session || !req.session.tipoUsuario) {
        return res.redirect('/'); 
    }

    const tipoUsuario = req.session.tipoUsuario;
    const usuarioCodigo = req.session.usuarioCodigo; 
    let query = '';
    let params = [];

    if (tipoUsuario === 'Tecnico') {
        
        query = `
            SELECT 
                a.codigo, 
                CONCAT(e.marca,' ',e.modelo,' - ', e.numero_serie) AS equipo, 
                CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
                a.fecha_asignacion,
                a.fecha_finalizacion, 
                a.estado
            FROM asignacion_equipo a
            JOIN equipo e ON a.equipo_codigo = e.codigo
            JOIN usuario u ON a.usuario_codigo = u.codigo
            WHERE a.estado = 'ACTIVO' AND u.codigo = ?
        `;
        params = [usuarioCodigo];
    } else {
        
        query = `
            SELECT 
                a.codigo, 
                CONCAT(e.marca,' ',e.modelo,' - ', e.numero_serie) AS equipo, 
                CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
                a.fecha_asignacion,
                a.fecha_finalizacion, 
                a.estado
            FROM asignacion_equipo a
            JOIN equipo e ON a.equipo_codigo = e.codigo
            JOIN usuario u ON a.usuario_codigo = u.codigo
            WHERE a.estado = 'ACTIVO' AND u.tipo = 'Tecnico'
        `;
    }

    conexion.query(query, params, (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Ocurrió un error en la base de datos.');
        }

        res.render('asignacion_equipo/index', { asignacion_equipo: resultado, tipoUsuario });
    });
});


router.get('/asignacion_equipofin', (req, res) => {
    const query = `
        SELECT 
            a.codigo, 
            CONCAT(e.marca,' ',e.modelo,' - ', e.numero_serie) AS equipo, 
            CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
            a.fecha_asignacion,
            a.fecha_finalizacion, 
            a.estado
        FROM asignacion_equipo a
        JOIN equipo e ON a.equipo_codigo = e.codigo
        JOIN usuario u ON a.usuario_codigo = u.codigo
        WHERE a.estado = 'FINALIZADO' AND u.tipo = 'Tecnico'
    `;

    conexion.query(query, (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('asignacion_equipo/indexfin', { asignacion_equipo: resultado });
    });
});

router.get('/crearasignacion', (req, res) => {
    conexion.query('SELECT codigo, CONCAT(marca," ", modelo, " - ", numero_serie) AS equipo FROM equipo WHERE estado = "INGRESADO"',
        (errorEquipos, equipos) => {
            if (errorEquipos) {
                console.log(errorEquipos);
                return;
            }

            conexion.query('SELECT codigo, CONCAT(nombre, " ", apellido) AS tecnico FROM usuario WHERE tipo = "Tecnico"',
                (errorTecnicos, tecnicos) => {
                    if (errorTecnicos) {
                        console.log(errorTecnicos);
                        return;
                    }

                    res.render('asignacion_equipo/crear', { equipos, tecnicos });
                });
        });
});
router.post('/saveasignacion_equipo', metodos.saveasignacion_equipo);

router.get('/verasignacion/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query(`
        SELECT 
            a.codigo, 
            a.equipo_codigo,
            e.marca,
            e.modelo, 
            e.numero_serie, 
            CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
            u.codigo AS tecnico_codigo,
            a.fecha_asignacion,
            a.fecha_finalizacion,
            a.estado
        FROM asignacion_equipo a
        JOIN equipo e ON a.equipo_codigo = e.codigo
        JOIN usuario u ON a.usuario_codigo = u.codigo
        WHERE a.codigo = ? AND u.tipo = 'Tecnico'`,
        [codigo], (errorAsignacion, resultadoAsignacion) => {
            if (errorAsignacion) {
                console.log(errorAsignacion);
                return;
            }

            res.render('asignacion_equipo/ver', { asignacion_equipo: resultadoAsignacion[0] });
        });
});

router.get('/verasignacionfin/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query(`
        SELECT 
            a.codigo, 
            a.equipo_codigo,
            e.marca,
            e.modelo,
            e.numero_serie, 
            CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
            u.codigo AS tecnico_codigo,
            a.fecha_asignacion,
            a.fecha_finalizacion,
            a.estado
        FROM asignacion_equipo a
        JOIN equipo e ON a.equipo_codigo = e.codigo
        JOIN usuario u ON a.usuario_codigo = u.codigo
        WHERE a.codigo = ? AND u.tipo = 'Tecnico'`,
        [codigo], (errorAsignacion, resultadoAsignacion) => {
            if (errorAsignacion) {
                console.log(errorAsignacion);
                return;
            }

            res.render('asignacion_equipo/verfin', { asignacion_equipo: resultadoAsignacion[0] });
        });
});

router.get('/editarasignacion/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query(`
        SELECT 
            a.codigo, 
            a.equipo_codigo,
            e.marca,
            e.modelo,
            e.numero_serie, 
            CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
            u.codigo AS tecnico_codigo,
            a.fecha_asignacion,
            a.fecha_finalizacion,
            a.estado
        FROM asignacion_equipo a
        JOIN equipo e ON a.equipo_codigo = e.codigo
        JOIN usuario u ON a.usuario_codigo = u.codigo
        WHERE a.codigo = ? AND u.tipo = 'Tecnico'`,
        [codigo], (errorAsignacion, resultadoAsignacion) => {
            if (errorAsignacion) {
                console.log(errorAsignacion);
                return;
            }

            conexion.query('SELECT codigo, CONCAT(marca, " ", modelo, " - ", numero_serie) AS equipo FROM equipo',
                (errorEquipos, equipos) => {
                    if (errorEquipos) {
                        console.log(errorEquipos);
                        return;
                    }

                    conexion.query('SELECT codigo, CONCAT(nombre, " ", apellido) AS tecnico FROM usuario WHERE tipo = "Tecnico"',
                        (errorTecnicos, tecnicos) => {
                            if (errorTecnicos) {
                                console.log(errorTecnicos);
                                return;
                            }

                            res.render('asignacion_equipo/editar', {
                                asignacion_equipo: resultadoAsignacion[0],
                                equipos,
                                tecnicos
                            });
                        });
                });
        });
});
router.post('/editasignacion_equipo', metodos.editasignacion_equipo);

router.get('/finalizarasignacion/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query(`
        SELECT 
            a.codigo, 
            a.equipo_codigo,
            e.marca,
            e.modelo, 
            e.numero_serie, 
            CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
            u.codigo AS tecnico_codigo,
            a.fecha_asignacion,
            a.fecha_finalizacion,
            a.estado
        FROM asignacion_equipo a
        JOIN equipo e ON a.equipo_codigo = e.codigo
        JOIN usuario u ON a.usuario_codigo = u.codigo
        WHERE a.codigo = ? AND u.tipo = 'Tecnico'`,
        [codigo], (errorAsignacion, resultadoAsignacion) => {
            if (errorAsignacion) {
                console.log(errorAsignacion);
                return;
            }

            conexion.query('SELECT codigo, CONCAT(marca, " ", modelo, " - ", numero_serie) AS equipo FROM equipo',
                (errorEquipos, equipos) => {
                    if (errorEquipos) {
                        console.log(errorEquipos);
                        return;
                    }

                    conexion.query('SELECT codigo, CONCAT(nombre, " ", apellido) AS tecnico FROM usuario WHERE tipo = "Tecnico"',
                        (errorTecnicos, tecnicos) => {
                            if (errorTecnicos) {
                                console.log(errorTecnicos);
                                return;
                            }

                            res.render('asignacion_equipo/finalizar', {
                                asignacion_equipo: resultadoAsignacion[0],
                                equipos,
                                tecnicos
                            });
                        });
                });
        });
});
router.post('/endasignacion_equipo', metodos.endasignacion_equipo);

router.get('/desfinalizarasignacion/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query(`
        SELECT 
            a.codigo, 
            a.equipo_codigo,
            e.marca,
            e.modelo, 
            e.numero_serie, 
            CONCAT(u.nombre, ' ', u.apellido) AS tecnico,
            u.codigo AS tecnico_codigo,
            a.fecha_asignacion,
            a.fecha_finalizacion,
            a.estado
        FROM asignacion_equipo a
        JOIN equipo e ON a.equipo_codigo = e.codigo
        JOIN usuario u ON a.usuario_codigo = u.codigo
        WHERE a.codigo = ? AND u.tipo = 'Tecnico'`,
        [codigo], (errorAsignacion, resultadoAsignacion) => {
            if (errorAsignacion) {
                console.log(errorAsignacion);
                return;
            }

            conexion.query('SELECT codigo, CONCAT(marca, " ", modelo, " - ", numero_serie) AS equipo FROM equipo',
                (errorEquipos, equipos) => {
                    if (errorEquipos) {
                        console.log(errorEquipos);
                        return;
                    }

                    conexion.query('SELECT codigo, CONCAT(nombre, " ", apellido) AS tecnico FROM usuario WHERE tipo = "Tecnico"',
                        (errorTecnicos, tecnicos) => {
                            if (errorTecnicos) {
                                console.log(errorTecnicos);
                                return;
                            }

                            res.render('asignacion_equipo/deshacerfin', {
                                asignacion_equipo: resultadoAsignacion[0],
                                equipos,
                                tecnicos
                            });
                        });
                });
        });
});
router.post('/undoendasignacion_equipo', metodos.undoendasignacion_equipo);

module.exports = router;


