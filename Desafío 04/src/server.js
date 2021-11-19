const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Conteiner = require('./classes/Container');
const PATH = './files/productos.json';
const conteiner = new Conteiner(PATH);
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log('Server listening on port: '+PORT)
})
const productsRouter = require('./routes/products');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})
const upload = multer({storage:storage});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api/images',express.static(__dirname+'/public'))
app.use('/api/products',productsRouter)
app.post('/api/uploadfile',upload.single('file'),(req,res)=>{
    const files = req.files;
    if (!files||files.length===0){
        res.status(500).send({message:"No se subieron archivos"})
    }else{
        res.send(files)
    }

})