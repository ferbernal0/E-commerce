import express from 'express';
import cors from 'cors';
import Contenedor from './classes/Contenedor.js';
import productsRouter from './routes/products.js';
import upload from './services/uploader.js';
const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor();

const server = app.listen(PORT,()=>{
    console.log("Listening on port: ",PORT)
})


app.set('views','./views');
app.set('view engine','pug');
app.use(express.static('public'));
app.get('/holaPug',(req,res)=>{
    res.render('hello',{message:'Test Desaf'})
})

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
// app.use(express.static('public'));
app.use('/api/products',productsRouter);

app.get('/',(req,res)=>{
    res.render('products.pug',{productsRouter});
})

app.get('/view/products',(req,res)=>{
    res.render('list.pug');
})

app.post('/api/products',(req,res)=>{
    let prodId = parseInt(req.body.pid);
    contenedor.registrarProd(prodId).then(result=>{
        res.send(result);
    })
})
app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió el archivo."})
    }
    res.send(files);
})
app.get('/view/products',(req,res)=>{
    contenedor.getAll().then(result=>{
        let data = result.payload;
        let preparedObject ={
            products : data
        }
        res.render('products',preparedObject)
    })
})