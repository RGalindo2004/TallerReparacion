const express = require('express');
const router = express.Router();

const conexion = require('./database/db');

//USUARIOS
router.get('/empleados', (req, res) => {
    conexion.query('SELECT * FROM usuario', (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }
        else {
            res.render('empleado/index', { empleados: resultado });
        }
    });
});


router.get('/crearempleado', (req, res) => {
    res.render('empleado/crear');
});

const metodos = require('./controllers/me');
router.post('/saveempleado', metodos.saveempleado);

module.exports = router;