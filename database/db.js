const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
<<<<<<< HEAD
    password: 'Oseguera123',
=======
    password: 'jair123',
>>>>>>> bb9556bc0096896b4629e56eeb1a2eb2938661ab
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