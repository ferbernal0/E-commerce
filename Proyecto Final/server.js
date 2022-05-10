const express = require('express');
const { Server : SocketServer } = require('socket.io');
const { Server : HttpServer, request} = require('http');
const { connected } = require( 'process' );
const MongoStore = require('connect-mongo')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config')

/* CARGA DE PRODUCTOS */
const Contenedor = require('./models/contenedor');
const productosContenedor = new Contenedor('/data/productos.json')

/* CARGA DE CHAT */
const Mensajes = require( './models/messages.js' );
const mensajes = new Mensajes('/data/messages.json')

const app = express()
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

/* CARGA DE SESION */
const session = require( 'express-session' );

/* CARGA DE MÉTODOS */
const authWebRouter = require('./routers/web/auth')
const homeRouter = require('./routers/web/home');
const productosRouter = require('./routers/web/productos');

/* CARGA MÓDULOS DE TEST DE AXIOS */
const {testAxios} = require('./test/axios');

/* HABILITA EL USO DEL JSON */
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'secreto',
    reseave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}))

/* CREA RELACIÓN A CARPETA 'PUBLIC' */
app.use( express.static('public') );


/* CARGA LOS ROUTERS */
app.use(authWebRouter)
app.use(homeRouter)
app.use(productosRouter)

app.use(passport.initialize());
app.use(passport.session());


/* CREA EL WEBSOCKET */
io.on('connection', async (socket) => {

    /* CARGA DE PRODUCTOS INGRESADOS */
    socket.on('new-product', async(producto) =>{
        await productosContenedor.save(producto);
        const productos = await productosContenedor.getAll()
        io.sockets.emit('productos', productos) 
    })

    /* CARGA EL CHAT */
    const messages = await mensajes.getMessagess();
    socket.emit('messages', messages);

    socket.on('new-message', async data => {
        data.fechaHora = new Date().toLocaleString();
        await mensajes.saveMessages(data);
        const messages = await mensajes.getMessagess();
        io.sockets.emit('messages', messages);
    }) 
})

/* REALIZA LA CONECCIÓN Y VERIFICA ERRORES */
const PORT = 8080;

const connectedServer = httpServer.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor en Http con Websocket escuchando en el puerto ${connectedServer.address().port}`)
})

/* mongoose.connect(config.mongoLocal.cnxStr, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if(err) {
      console.error('Error connection mongo');
    } */


/* HABILITA EL USO DEL TEST AXIOS */
//testAxios()


connectedServer.on('error', error => console.log(`Eror en el servidor ${PORT}`))
