const express = require('express');
const router = express.Router();
const conexion = require('./database/db');

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
                res.redirect('/menu');
            } else {
                res.render('login', { error: 'Usuario o contraseña incorrectos' });
            }
        } else {
            res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
    });
});
router.get('/menu', (req, res) => {
    res.render('index');
});

router.get('/logout', (req, res) => {
    res.redirect('/');
});

const metodos = require('./controllers/me');

//USUARIOS
router.get('/usuarios', (req, res) => {
    conexion.query("SELECT * FROM usuario WHERE estado = 'ACT'", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('usuario/index', { usuario: resultado });
    });
});

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
    conexion.query("SELECT * FROM equipo", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('equipo/index', { equipo: resultado });
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

                res.render('equipo/crear', { equipo: resultadoEquipo[0], tipos: resultadoTipos, marcas: resultadoMarcas });
            });
        });
    });
});
router.post('/saveequipo', metodos.saveequipo);

//EDITAR EQUIPO (temp)
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
        WHERE a.estado = 'ACTIVO' AND u.tipo = 'Tecnico'
    `;

    conexion.query(query, (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('asignacion_equipo/index', { asignacion_equipo: resultado });
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
