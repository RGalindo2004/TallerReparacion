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

router.get('/usuarios', (req, res) => {
    conexion.query("SELECT * FROM usuario WHERE estado = 'ACT'", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('usuario/index', { usuarios: resultado });
    });
});

router.get('/usuariosdes', (req, res) => {
    conexion.query("SELECT * FROM usuario WHERE estado = 'INA'", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('usuario/indexdes', { usuarios: resultado });
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

            res.render('usuario/crear', { usuarios: resultadoUsuario, tipos: resultadoTipo });
        });
    });
});

const metodos = require('./controllers/me');
router.post('/saveusuario', metodos.saveusuario);

module.exports = router;
