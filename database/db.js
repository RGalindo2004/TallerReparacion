const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'tallerreparacion'
});

conexion.connect((error) => {
    if (error) {
        console.error('Se presentó un error' + error);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

module.exports = conexion;