const conexion = require('../database/db');

exports.saveempleado=(req,res) => {

    const nombre = (req.body.nombre)
    const apellido = (req.body.apellido)
    const fechapago = (req.body.fechapago)
    const horastrabajadasmes = (req.body.horastrabajadasmes)
    const valorhora = (req.body.valorhora)
    const monto = horastrabajadasmes * valorhora

    conexion.query('INSERT INTO empleados SET ?',{nombre:nombre, apellido:apellido, fechapago:fechapago, horastrabajadasmes:horastrabajadasmes, valorhora:valorhora, monto:monto}, (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/empleados');
        }
    });
}

exports.savedeposito = (req, res) => {
    const codigoempleado = req.body.codigoempleado;
    const cantidad = req.body.cantidad;
    const fechadeposito = req.body.fecha;
    const monto = parseFloat(req.body.monto) + cantidad;

    conexion.query('INSERT INTO depositos SET ?', { codigoempleado: codigoempleado, cantidad:cantidad, fechadeposito:fechadeposito }, (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/deposito/' + codigoempleado);
        }
    });

    conexion.query('UPDATE empleados SET monto = ? WHERE codigo = ?', [monto, codigoempleado], (error, results) => {
        if (error) {
            console.log(error);
        }
    });
}

exports.saveretiro = (req, res) => {
    const codigoempleado = req.body.codigoempleado;
    const cantidad = req.body.cantidad;
    const fecharetiro = req.body.fecharetiro;
    const monto = req.body.monto - cantidad;

    conexion.query('INSERT INTO retiros SET ?', { codigoempleado: codigoempleado, cantidad:cantidad, fecharetiro:fecharetiro}, (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/retiro/' + codigoempleado);
        }
    });

    conexion.query('UPDATE empleados SET monto = ? WHERE codigo = ?', [monto, codigoempleado], (error, results) => {
        if (error) {
            console.log(error);
        }
    });
}

exports.savepago = (req, res) => {
    const codigoempleado = req.body.codigoempleado;
    const cantidad = parseFloat(req.body.cantidad);
    const fechapago = req.body.fecha;
    const monto = parseFloat(req.body.monto) + cantidad;

    conexion.query('INSERT INTO pagos SET ?', { codigoempleado: codigoempleado, cantidad:cantidad, fechapago:fechapago }, (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/pago/' + codigoempleado);
        }
    });

    conexion.query('UPDATE empleados SET monto = ? WHERE codigo = ?', [monto, codigoempleado], (error, results) => {
        if (error) {
            console.log(error);
        }
    });
}