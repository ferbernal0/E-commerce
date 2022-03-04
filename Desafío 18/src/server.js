import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import router from './routes/products.js';
import cartRouter from './routes/cart.js';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import {products,chats} from './daos/index.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from './config.js';
import ios from 'socket.io-express-session';
import passport from 'passport';
import {initializePassportConfig, initializePassportLocal} from './passport-config.js';
import minimist from 'minimist';
import {fork} from 'child_process';
import cluster from 'cluster';
import core from 'os';
import {createLogger} from './utils.js';
import compression from 'compression';

let minimizedArgs = minimist(process.argv.slice(2))
let configArg ={
    others:minimizedArgs._,
    mode: minimizedArgs.mode||'fork',
    port:  minimizedArgs.p||8080
}

const app = express();
const PORT = configArg.port;
app.use(compression())

let server 

if (configArg.mode==="cluster"){
    if (cluster.isPrimary){
        console.log(`Proceso primario en modo CLUSTER con pid ${process.pid} corriendo`);
        for (let i=0;i<core.cpus().length;i++){
            cluster.fork()
        }
        cluster.on('exit',(worker,code,signal)=>{
            console.log(`Worker en modo CLUSTER con pid ${worker.process.pid} finalizado`);
            cluster.fork()
            console.log(`Cluster restaurado`);
        })
    }else {
        console.log(`Worker en modo CLUSTER con pid ${process.pid} iniciado`);
        server = app.listen(PORT,()=>console.log(`Worker en modo CLUSTER con pid ${process.pid} escuchando en el puerto ${PORT}`))
    }
}else{
    if (cluster.isPrimary){
        console.log(`Proceso primario en modo fork con pid ${process.pid} corriendo`);    
        cluster.fork()    
    }else {
        console.log(`soy un worker en modo fork con pid ${process.pid}`);  
        server = app.listen(PORT,()=>{
            console.log('Server listening on port: '+PORT)
        })  
    }
}

export const io = new Server(server);
export const admin=true;

const baseSession = (session({
    store:MongoStore.create({mongoUrl:config.mongoSessions.baseUrl}),
    resave:true,
    cookie:{maxAge:600000},
    saveUninitialized:true,
    secret:config.secretCode.key
}))
//--------------------LOGGERS---------------------------------------------------------

const logger = createLogger(config.nodeEnv.env)
app.use((req,res,next)=>{
    logger.log('info',`${req.method} at ${req.path}`)
    next();
})
app.get('/logger',(req,res)=>{
    logger.info('mostrando hola')
    res.send('hola logger')
})
app.get('/error',(req,res)=>{
    logger.error("Este es un error");
    res.send("error")
})
// app.get('/*',(req,res)=>{
//     logger.warn('visited unused endpoint')
//     res.status(404).send({error:"invalid endpoint"})
// })

//-----------------------------------------------------------------------------------
app.engine('handlebars',engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(baseSession);
io.use(ios(baseSession));
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    // console.log('Peticion hecha a las: '+time.toTimeString().split(" ")[0],req.method,req.url);    
    req.auth = admin
    next();
})
initializePassportConfig();
initializePassportLocal();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname+'/public'));
app.use('/api/products',router);
app.use('/api/cart',cartRouter);

app.get('/views/products',(req,res)=>{
    products.getAll().then(result=>{        
        let {data}=result;        
        let preparedObj={
            products : JSON.parse(JSON.stringify(data))
        }
        res.render('products',preparedObj);
    })   
})

//muestra los productos que tengo actualmente
io.on('connection',async socket=>{
    console.log(`Socket ${socket.id} connected`);
    let auth = admin;
    let productsToShow = await products.getAll();       
    let productsProccesed = JSON.parse(JSON.stringify(productsToShow))     
    socket.emit('updateProducts',productsProccesed);   
    socket.emit('auth',auth)   
})

//Chats en pantalla-----------------------------------------  
io.on('connection',async socket=>{ 
    socket.broadcast.emit('thirdConnection','Alguien se ha unido al chat') 
    let data = await chats.getAllChats();     
    socket.emit('messagelog',data);   
    socket.on('message',async res=>{               
        let result = await chats.save(res);        
        let chatData = await chats.getAllChats();        
        io.emit('messagelog',chatData);       
    })             
})

app.get('/logout',(req,res)=>{    
    req.session.destroy((err) => {        
        res.redirect('/')         
    })
})

// REGISTRO CON PASSPORT
app.post('/register',passport.authenticate('register',{failureRedirect:'/failedRegister'}),async (req,res)=>{   
    res.send({message:'usuario registrado'})  
})

app.post('/failedRegister',(req,res)=>{
    console.log('usuario ya registrado');
    res.send({error:'no se pudo autenticar'})
})

app.post('/login',passport.authenticate('login',{failureRedirect:'/failedLogin'}),(req,res)=>{
    res.send({message:'logged in'})
})

app.post('/failedLogin',(req,res)=>{
    console.log('usuario ya logueado');
    res.send({error:'no se pudo logguear'})
})

app.get('/checkSession',(req,res)=>{    
    res.send(req.user)
})

// app.get('/logout',(req,res)=>{
//     console.log('en logout');
//     req.logout();
// })


//logueo con facebook
app.get('/auth/facebook',passport.authenticate('facebook',{scope:['email']}),(req,res)=>{
    console.log('dentro de logueo facebook');
})

app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/failedLoginFb',
    successRedirect: '/'
}),(req,res)=>{
    res.send({message:'logueado'})    
})

app.post('/failedLoginFb',(req,res)=>{   
    res.send({error:'no se pudo logguear'})
})

app.get('/info',async (req,res)=>{  
    let argsData  
    if (process.argv.slice(2).length===0) argsData = 'No hay argumentos'
    else argsData = process.argv.slice(2)
    let info ={
        args: argsData,
        cwd: process.cwd(),
        pid: process.pid,
        version: process.version,
        title: process.title,
        platform: process.platform ,
        memoryUsage: JSON.stringify(process.memoryUsage()),
        execPath: process.execPath,    
        CPUs:core.cpus().length
    }    
    res.send(info)     
})

app.get('/api/randoms',(req,res)=>{  
    let data = req.query.cant
    if (data===''||data===undefined) data= 100000000
    else {
        parseInt(data)        
    }    
    const randoms = fork('calc',[data]);
    randoms.on('message',(data)=>{
        res.send({randomsNumbers:data})
    })
})

//capturo las rutas fuera de las que estan diseñadas
app.use('/*', function(req, res){
    let error = {
        route:req.params[0],
        method:req.method,
    }    
    logger.warn('visited unused endpoint')
    res.render('error',error)
});

