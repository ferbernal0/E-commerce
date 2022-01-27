import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import router from './routes/products.js';
import cartRouter from './routes/cart.js'
import {Server} from 'socket.io';
import __dirname from './utils.js';
import {products,chats,users} from './daos/index.js';
// import { generate_dataProducts } from './utils.js';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import config from './config.js';
import ios from 'socket.io-express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import {initializePassportConfig, initializePassportLocal} from './passport-config.js';

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log('Server listening on port: '+PORT)
})
export const io = new Server(server);
export const admin=true;


const baseSession = (session({
    store:MongoStore.create({mongoUrl:config.mongoSessions.baseUrl}),
    resave:true,
    cookie:{maxAge:600000},
    saveUninitialized:true,
    secret:"CoderChat"
}))

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
    console.log('Peticion hecha a las: '+time.toTimeString().split(" ")[0],req.method,req.url);    
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

//logueo y registro con usuario y contrasena

// app.post('/register',async (req,res)=>{
//     let userRegister = req.body;    
//     //valida que no este un usuario ya registrado
//     let {email} =req.body;    
//     let userExists = await users.getByEmail(email);   
//     if (userExists.status =='success') return res.status(400).send({error:'usuario ya registrado'})
//     let result = await users.save(userRegister)
//     res.send({message:'user created',user:result})    
// })

// app.post('/login',async (req,res)=>{    
//     let {email,password} = req.body;    
//     if(!email||!password) return res.status(400).send({error:"Incomplete fields"})   
//     const user = await users.getByEmail(email);    
//     if(user.status=='Error') return res.status(404).send({error:'usuario no encontrado'})    
//     if(user.data.password!==password) return res.status(400).send({error:'contrasena incorrecta'})
//     req.session.user={
//         username:user.data.username,
//         email:user.data.email,
//         avatar:user.data.avatar,
//         age:user.data.age,
//         name:user.data.name,
//         lastName:user.data.lastName
//     }
//     res.send({status:'logueado'})
// })

// app.get('/currentUser',(req,res)=>{    
//     res.send(req.session.user)    
// })

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

//capturo las rutas fuera de las que estan diseñadas
app.use('/*', function(req, res){
    let error = {
        route:req.params[0],
        method:req.method,
    }    
    res.render('error',error)
});

