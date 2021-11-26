const express = require('express');
const upload = require('./services/upload')
const cors = require('cors');
const Conteiner = require('./classes/Conteiner');
const PATH = './files/productsList.json';
const conteiner = new Conteiner(PATH);
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log('Server listening on port: '+PORT)
})
const productsRouter = require('./routes/products');

app.use(cors());
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Peticion hecha a las: '+time.toTimeString().split(" ")[0])
    next();
})

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api/images',express.static(__dirname+'/public'))
app.use('/api/products',productsRouter)
app.post('/api/uploadfile',upload.single('file'),(req,res)=>{
    const file = req.file;
    if (!file||file.length===0){
        res.status(500).send({message:"No se un subio archivo"})
    }else{
        res.send(file)
    }
})
app.post('/api/uploadfiles',upload.array('files',12),(req,res)=>{
    const files = req.files;
    if (!files||files.length===0){
        res.status(500).send({message:"No se subieron archivos"})
    }else{
        res.send(files)
    }
})