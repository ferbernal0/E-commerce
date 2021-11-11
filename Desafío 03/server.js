const express = require('express');
const Contenedor = require('./classes/Clase');

const app = express();
const PORT = process.env.PORT||8080;
const contenedor = new Contenedor();


const server = app.listen(PORT,()=>{
    console.log("Servidor en escuha por:"+PORT)
})

app.get('/',(req,res)=>{
    res.send('Mi primer Server');
})

app.get('/productos',(req,res)=>{
    console.log('req.query');
    contenedor.getAll().then(result=>{
        if(result.status==="success"){
                res.send(result.product);
        }else{
            res.status(500).send(result.message);
        }
    })
})

app.get('/productoRandom/:pid',(req,res)=>{
    const prodId = req.params.pid;
    contenedor.getById(prodId).then(result=>{
        res.send(result);
    })
})