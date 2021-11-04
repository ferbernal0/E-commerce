const Contenedor = require('./Class');

const contenedor = new Contenedor();

contenedor.deleteById('003').then(result=>{
    console.log(result.message);
})