import multer from 'multer';
import __dirname from '../utils.js';

//se podría utilizar para adjuntar archivos a las caracteristicas del producto, actualmente se ingresa una url para la imagen, no se sube un archivo
const storage = multer.diskStorage({
    destination:function(req,file,cb){        
        //con upload
        // if(file.fieldname==-"thumbnail"){
        //     cb(null,'images')
        // }else if (file.fieldname==="documents"){
        //     cb(null,"documents")
        // }
        cb(null,__dirname+'public')       
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.fieldname+"."+file.originalname.split(".")[1])
    }
})
const upload = multer({storage:storage});

export default upload