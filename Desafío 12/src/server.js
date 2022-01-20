import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import router from './routes/products.js';
import cartRouter from './routes/cart.js'
import {Server} from 'socket.io';
import __dirname from './utils.js';
import {products,chats,users,messages} from './daos/index.js';
import { generate_dataProducts } from './utils.js';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import config from './config.js';
import ios from 'socket.io-express-session'

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log('Server listening on port: '+PORT)
})
export const io = new Server(server);
export const admin=true;

const baseSession = (session({
    store:MongoStore.create({mongoUrl:config.mongoSessions.baseUrl}),
    resave:false,
    saveUninitialized:false,
    secret:"CoderChat"
}))

app.engine('handlebars',engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(baseSession);
io.use(ios(baseSession));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Peticion hecha a las: '+time.toTimeString().split(" ")[0],req.method,req.url);    
    req.auth = admin
    next();
})
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
app.get('/currentUser',(req,res)=>{
    res.send(req.session.user)
})

//muestra los productos que tengo actualmente
io.on('connection',async socket=>{
    console.log(`Socket ${socket.id} connected`);
    let auth = admin;
    let productsToShow = await products.getAll();    
    // let productsToShow = generate_dataProducts();     
    let productsProccesed = JSON.parse(JSON.stringify(productsToShow))     
    socket.emit('updateProducts',productsProccesed);   
    socket.emit('auth',auth)   
})

//Chats en pantalla-----------------------------------------  
io.on('connection',async socket=>{ 
    socket.broadcast.emit('thirdConnection','Alguien se ha unido al chat') 
    let data = await chats.getAllChats();    
    // console.log('esto es data del getallchat server')
    socket.emit('messagelog',data);   
    socket.on('message',async res=>{               
        let result = await chats.save(res);        
        let chatData = await chats.getAllChats();        
        io.emit('messagelog',chatData);       
    })             
})

app.post('/register',async (req,res)=>{
    let userRegister = req.body;
    let result = await users.save(userRegister)
    res.send({message:'user created',user:result})
})

app.post('/login',async (req,res)=>{    
    let {email,password} = req.body;    
    if(!email||!password) return res.status(400).send({error:"Incomplete fields"})   
    const user = await users.getByEmail(email);    
    if(user.status=='Error') return res.status(404).send({error:'usuario no encontrado'})
    console.log(user);
    if(user.data.password!==password) return res.status(400).send({error:'contrasena incorrecta'})
    req.session.user={
        username:user.data.username,
        email:user.data.email,
        avatar:user.data.avatar,
        age:user.data.age,
        name:user.data.name,
        lastName:user.data.lastName
    }
    res.send({status:'logueado'})
})

app.get('/logout',async (req,res)=>{
    console.log('es logout');
    req.session.destroy((err) => {
        res.redirect('/') 
      })
})



//capturo las rutas fuera de las que estan diseñadas
app.use('/*', function(req, res){
    let error = {
        route:req.params[0],
        method:req.method,
    }    
    res.render('error',error)
});

