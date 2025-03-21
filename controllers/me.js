const conexion = require('../database/db');

exports.saveusuario=(req,res) => {

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correoelectronico = req.body.correoelectronico;
    const contrasena = req.body.contrasena;
    const telefono = req.body.telefono;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const genero = req.body.genero;
    const estado = "ACT";
    const tipo = req.body.tipo;

    conexion.query('INSERT INTO usuario SET ?',{nombre:nombre,apellido:apellido,correoelectronico:correoelectronico,contrasena:contrasena,telefono:telefono,fecha_nacimiento:fecha_nacimiento, genero:genero, estado:estado,tipo:tipo},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/usuarios');
        }
    });
}

exports.disableusuario=(req,res) => {
    const codigo = req.body.codigo;
    conexion.query('UPDATE usuario SET estado = "INA" WHERE codigo = ?',[codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/usuariosdes');
        }
    });
}

exports.enableusuario=(req,res) => {
    const codigo = req.body.codigo;
    conexion.query('UPDATE usuario SET estado = "ACT" WHERE codigo = ?',[codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/usuarios');
        }
    });
}