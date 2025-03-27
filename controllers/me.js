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

exports.actualizarequipo=(req,res) => {
    const codigo = req.body.codigo;
    const numero_serie = req.body.numero_serie;
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado;
    const tipo_equipo = req.body.tipo_equipo;

    conexion.query('UPDATE equipo SET numero_serie = ?, marca = ?, modelo = ?, descripcion = ?, estado = ?, tipo_equipo = ? WHERE codigo = ?',
        [numero_serie, marca, modelo, descripcion, estado, tipo_equipo, codigo],
        (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/equipos');
            }
        }
    );
}

exports.deleteequipo = (req, res) => {
    const codigo = req.body.codigo;

    conexion.query('UPDATE equipo SET estado = "DESCARTADO" WHERE codigo = ?', [codigo], (error) => {
        if (error) {
            console.log(error);
        }

        res.redirect('/equipos');
    }
    );
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

//MARCA DE EQUIPOS
exports.savemarca=(req,res) => {
    const nombre = req.body.nombre;

    conexion.query('INSERT INTO marca SET ?',{nombre:nombre},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/marca');
        }
    });
}

exports.deletemarca=(req,res) => {
    const codigo = req.body.codigo;
    conexion.query('DELETE FROM marca WHERE codigo = ?',[codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/marca');
        }
    });
}

exports.editmarca=(req,res) => {
    const codigo = req.body.codigo;
    const nombre = req.body.nombre;

    conexion.query('UPDATE marca SET nombre = ? WHERE codigo = ?',[nombre,codigo],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/marca');
        }
    });
}

//ASIGNACIÓN DE EQUIPOS
exports.saveasignacion_equipo = (req, res) => {
    const equipo_codigo = req.body.equipo_codigo;
    const tecnico_codigo = req.body.tecnico_codigo;
    const fecha_asignacion = req.body.fecha_asignacion;
    const estado = req.body.estado;

    conexion.query(
        'INSERT INTO asignacion_equipo SET ?',
        { equipo_codigo: equipo_codigo, usuario_codigo: tecnico_codigo, fecha_asignacion: fecha_asignacion, estado: estado },
        (error) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Error al insertar asignación");
            }

            conexion.query(
                'UPDATE equipo SET estado = "EN_REPARACION" WHERE codigo = ?',
                [equipo_codigo],
                (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send("Error al actualizar estado del equipo");
                    }

                    res.redirect('/asignacion_equipo');
                }
            );
        }
    );
};


exports.endasignacion_equipo = (req, res) => {
    const codigo = req.body.codigo;
    const fecha_finalizacion = req.body.fecha_finalizacion;

    conexion.query(
        'UPDATE asignacion_equipo SET estado = "FINALIZADO", fecha_finalizacion = ? WHERE codigo = ?',
        [fecha_finalizacion, codigo],
        (error) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Error al actualizar la asignación");
            }

            conexion.query(
                'SELECT equipo_codigo FROM asignacion_equipo WHERE codigo = ?',
                [codigo],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send("Error al obtener equipo");
                    }
                    const equipo_codigo = result[0].equipo_codigo;

                    conexion.query(
                        'UPDATE equipo SET estado = "DISPONIBLE" WHERE codigo = ?',
                        [equipo_codigo],
                        (error) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send("Error al actualizar estado del equipo");
                            }

                            res.redirect('/asignacion_equipo');
                        }
                    );
                }
            );
        }
    );
};


exports.undoendasignacion_equipo=(req,res) => {
    const codigo = req.body.codigo;
    conexion.query('UPDATE asignacion_equipo SET estado = "ACTIVO", fecha_finalizacion = NULL WHERE codigo = ?',[codigo],(error)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/asignacion_equipo');
        }
    });
}

exports.editasignacion_equipo=(req,res) => {
    const codigo = req.body.codigo;
    const equipo_codigo = req.body.equipo_codigo;
    const tecnico_codigo = req.body.tecnico_codigo;
    const fecha_asignacion = req.body.fecha_asignacion;
    const estado = req.body.estado;

    conexion.query('INSERT INTO asignacion_equipo SET ?',{equipo_codigo:equipo_codigo,usuario_codigo:tecnico_codigo,fecha_asignacion:fecha_asignacion,estado:estado},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/asignacion_equipo');
        }
    });
}
