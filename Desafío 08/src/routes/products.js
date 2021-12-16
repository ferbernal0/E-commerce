import express from 'express';
import __dirname from '../utils.js';
import {io} from '../server.js'
import { authMiddleware } from '../utils.js';
import productConteiner from '../services/productConteiner.js';

const router = express.Router();
const productService = new productConteiner();

//GET para buscar todos los productos
router.get('/',async (req,res)=>{    
    
    let {data} = await productService.getAll()
    res.send(data)
})
//GET para buscar un producto por su id
router.get('/:id',async (req,res)=>{   
    let idReq = parseInt(req.params.id);        
    let {data} = await productService.getById(idReq);  
    if(data) {
        res.send(data)
    } else {
        res.status(404).send({error:`Producto con id:${idReq} no encontrado`})
    }
})

//POST para guardar un producto y luego visualizar el id asignado
router.post('/',authMiddleware,async (req,res)=>{            
    let newProduct = req.body;     
    let result = await productService.save(newProduct); 
    res.send(result)      
    if (result.status==="success"){        
            productService.getAll().then(result=>{
            io.emit('updateProducts',result)
        })
    }    
})

// PUT permite modificar algun dato del producto
router.put('/:id',authMiddleware,async (req,res)=>{           
    let idReq = parseInt(req.params.id);
    let upProduct = req.body;
    // let data = await conteiner.updateProduct(idReq,upProduct);
    let data = await productService.updateProduct(idReq,upProduct);
    res.send(data) 
             
})

// DELETE borra un producto por su id
router.delete('/:id',authMiddleware,async (req,res)=>{ 
    let idReq = parseInt(req.params.id);    
    let data = await productService.deleteById(idReq);
    res.send(data)    
})

export default router