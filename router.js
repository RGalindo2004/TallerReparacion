const express = require('express');
const router = express.Router();

const conexion = require('./database/db');

//EMPLEADOS
router.get('/empleados', (req, res) => {
    conexion.query('SELECT * FROM empleados', (error, resultado) => {
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

//DEPÓSITO
router.get('/deposito/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM depositos WHERE codigoempleado = ?', [codigo], (error, resultadoDeposito) => {
        if (error) {
            console.log(error);
            return;
        }

        conexion.query('SELECT * FROM empleados WHERE codigo = ?', [codigo], (error, resultadoEmpleado) => {
            if (error) {
                console.log(error);
                return;
            }

            res.render('deposito/index', { depositoempleado: resultadoDeposito, empleado: resultadoEmpleado[0] });
        });
    });
});

router.get('/creardeposito/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM empleados WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('deposito/crear', { empleado: resultado[0] });
    });
});
router.post('/savedeposito', metodos.savedeposito);

//RETIRO
router.get('/retiro/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM retiros WHERE codigoempleado = ?', [codigo], (error, resultadoRetiro) => {
        if (error) {
            console.log(error);
            return;
        }

        conexion.query('SELECT * FROM empleados WHERE codigo = ?', [codigo], (error, resultadoEmpleado) => {
            if (error) {
                console.log(error);
                return;
            }

            res.render('retiro/index', { retiroempleado: resultadoRetiro, empleado: resultadoEmpleado[0] });
        });
    });
});

router.get('/crearretiro/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM empleados WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('retiro/crear', { empleado: resultado[0] });
    });
});
router.post('/saveretiro', metodos.saveretiro);

//PAGOS
router.get('/pago/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM pagos WHERE codigoempleado = ?', [codigo], (error, resultadoPago) => {
        if (error) {
            console.log(error);
            return;
        }

        conexion.query('SELECT * FROM empleados WHERE codigo = ?', [codigo], (error, resultadoEmpleado) => {
            if (error) {
                console.log(error);
                return;
            }

            res.render('pago/index', { pagoempleado: resultadoPago, empleado: resultadoEmpleado[0] });
        });
    });
});

router.get('/crearpago/:id', (req, res) => {
    const codigo = req.params.id;

    conexion.query('SELECT * FROM empleados WHERE codigo = ?', [codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return;
        }

        res.render('pago/crear', { empleado: resultado[0] });
    });
});
router.post('/savepago', metodos.savepago);




///Maquinassss

router.get('/maquinas', (req, res) => {
    res.render('maquinas/index');
});

router.get('/marca', (req, res) => {
    res.render('marca/index');
});

router.get('/tipo', (req, res) => {
    res.render('tipo/index');
});


module.exports = router;