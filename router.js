const express = require('express');
const router = express.Router();

const conexion = require('./database/db');

//USUARIOS
router.get('/usuarios', (req, res) => {
    conexion.query("SELECT * FROM usuario WHERE estado = 'ACT'", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        
        else {
            res.render('usuario/index', { usuarios: resultado });
        }
    });
});

router.get('/usuariosdes', (req, res) => {
    conexion.query("SELECT * FROM usuario WHERE estado = 'INA'", (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        
        else {
            res.render('usuario/indexdes', { usuarios: resultado });
        }
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