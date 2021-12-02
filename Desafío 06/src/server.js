import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import Conteiner from './classes/Conteiner.js';
import Chats from './classes/chats.js';
import router from './routes/products.js';
import upload from './services/upload.js';
import {Server} from 'socket.io'
import __dirname from './utils.js'
import moment from 'moment';

const PATH = __dirname+'/files/productsList.json';
const CHATSPATH = __dirname+'/files/chatsHistorical.json'
const conteiner = new Conteiner(PATH);
const chats = new Chats(CHATSPATH)
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log('Server listening on port: '+PORT)
})
export const io = new Server(server);

app.engine('handlebars',engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Peticion hecha a las: '+time.toTimeString().split(" ")[0]);
    next();
})

app.use(express.static(__dirname+'/public'));
app.use('/api/products',router);

//para subir varios archivos
// app.post('/api/uploadfile',upload.fields([
    //     {
        //         name:'file', maxCount:1
        //     },
        //     {
            //         name:"documents", maxCount:3
            //     }
            // ]),(req,res)=>{
                //     const files = req.files;
                //     console.log(files);
                //     if(!files||files.length===0){
                    //         res.status(500).send({messsage:"No se subió archivo"})
                    //     }
                    //     res.send(files);
// })

app.get('/views/products',(req,res)=>{
    conteiner.getAll().then(result=>{
        let {data}=result;        
        let preparedObj={
            products : data
        }
        res.render('products',preparedObj);
    })
})

//muestra los productos que tengo actualmente
io.on('connection',async socket=>{
    console.log(`Socket ${socket.id} connected`);
    let products = await conteiner.getAll();
    socket.emit('updateProducts',products)
   
})

//Chats en pantalla
let {chatsData} = await chats.getAllChats()

io.on('connection',async socket=>{    
    socket.emit('messagelog',chatsData)    
    socket.on('message',async data=>{        
        let date = moment().format('DD/MM/YYYY HH:mm:ss')        
        data.date = date        
        await chats.saveChats(data)    
        io.emit('messagelog',chatsData);
    })
})

