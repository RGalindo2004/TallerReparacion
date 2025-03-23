const conexion = require('../database/db');

//USUARIOS
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

exports.editusuario=(req,res) => {
    const codigo = req.body.codigo;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correoelectronico = req.body.correoelectronico;
    const contrasena = req.body.contrasena;
    const telefono = req.body.telefono;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const genero = req.body.genero;
    const estado = req.body.estado;
    const tipo = req.body.tipo;

    conexion.query('UPDATE usuario SET nombre = ?, apellido = ?, correoelectronico = ?, contrasena = ?, telefono = ?, fecha_nacimiento = ?, genero = ?, estado = ?, tipo = ? WHERE codigo = ?',[nombre,apellido,correoelectronico,contrasena,telefono,fecha_nacimiento,genero,estado,tipo,codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/usuarios');
        }
    });
}

//EQUIPOS
exports.saveequipo=(req,res) => {
    const numero_serie = req.body.numero_serie;
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;
    const tipo_equipo = req.body.tipo_equipo;

    conexion.query('INSERT INTO equipo SET ?',{numero_serie:numero_serie,marca:marca,modelo:modelo,descripcion:descripcion,estado:estado, tipo_equipo:tipo_equipo},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/equipos');
        }
    });
}

//TIPO DE EQUIPOS
exports.savetipoequipo=(req,res) => {
    const nombre = req.body.nombre;

    conexion.query('INSERT INTO tipo_equipo SET ?',{nombre:nombre},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/tipo_equipo');
        }
    });
}

exports.deletetipoequipo=(req,res) => {
    const codigo = req.body.codigo;
    conexion.query('DELETE FROM tipo_equipo WHERE codigo = ?',[codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/tipo_equipo');
        }
    });
}

exports.edittipoequipo=(req,res) => {
    const codigo = req.body.codigo;
    const nombre = req.body.nombre;

    conexion.query('UPDATE tipo_equipo SET nombre = ? WHERE codigo = ?',[nombre,codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/tipo_equipo');
        }
    });
}