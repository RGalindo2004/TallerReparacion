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