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
    conexion.query('SELECT * FROM usuario WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        res.render('usuario/editar', { usuario: resultado[0] });
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
    const codigo = req.params.id;

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

            res.render('equipo/crear', { equipo: resultadoEquipo[0], tipos: resultadoTipos });
        });
    });
});
router.post('/saveequipo', metodos.saveequipo);

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

module.exports = router;
