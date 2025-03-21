const express = require('express') //Servidor local
const app = express()

app.set('view engine', 'ejs') //motor de plantillas

app.use(express.urlencoded({extended:false})); //Para recibir datos de un formulario
app.use(express(express.json));

//Para aplicar CSS
app.use(express.static('public'));
app.use('/styles', express.static(__dirname + '/styles')); 

//ruta
//app.get('/',(req,res)=>{
//    res.send('Este es un mensaje en la ruta')
//});

app.use('/' , require('./router')); //Para usar todas las rutas de router.js

app.listen(5000, () => {
console.log('Servidor Local http://localhost:5000')
})

