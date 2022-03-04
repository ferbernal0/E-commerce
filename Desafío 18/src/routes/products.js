import express from 'express';
import __dirname from '../utils.js';
import {io} from '../server.js'
import { authMiddleware, generate_dataProducts , createLogger} from '../utils.js';
import {products,persistence} from '../daos/index.js'
import config from '../config.js'

const router = express.Router();
const logger = createLogger(config.nodeEnv.env)

router.get('/products-test',(req,res)=>{
    let test_products = generate_dataProducts()
    res.send(test_products)
})

//GET para buscar todos los productos
router.get('/',async (req,res)=>{    
    let {data,message} = await products.getAll();//obtengo los productos del carrito      
    //PONER FILTRO DE ARRAY VACIO!!!!!!!
    if (data) {//si existen datos los envio, 
        res.send(data);
    } else {//si no existen datos para mostrar, entonces se envia el mensaje de error
       logger.error("Error, no existen datos para mostrar");
       res.status(404).send({error:message});
    }    
})
//GET para buscar un producto por su id
router.get('/:id',async (req,res)=>{   
    let productId_request = req.params.id;   
    if (persistence=='fileSystem'){
        productId_request= parseInt(productId_request);
    }    
    let {data} = await products.getById(productId_request); //busco un producto por su id , hago destructuring    
    if(data) {
        res.send(data);//envio los datos obtenidos
    } else {
        logger.error("Error, producto no encontrado");
        res.status(404).send({error:`Producto con id: ${productId_request} no encontrado`});
    }
})

//POST para guardar un producto y luego visualizar el id asignado
router.post('/',authMiddleware,async (req,res)=>{            
    let product_to_add = req.body;//obtengo los datos del producto que quiero agregar    
    let result = await products.save(product_to_add);//intento grabar el producto     
    res.send(result);//este resultado puede ser success o error      
    if (result.status==="success"){ //si el resultado fue success es porque se pudo grabar el producto, hago un emit       
            products.getAll().then(result=>{            
            io.emit('updateProducts',result);
        })
    }else{
        logger.error("Error al intentar guardar el producto");
    }    
})

// PUT permite modificar algun dato del producto
router.put('/:id',authMiddleware,async (req,res)=>{           
    let product_to_update = req.params.id;// obtengo el id del producto que quiero actualizar   
    if (persistence=='fileSystem'){
        product_to_update= parseInt(product_to_update);//parseo el id
    }    
    let product = req.body;//obtengo todo el producto completo que quiero modificar
    let result = await products.updateById(product_to_update,product);//intento modificar el producto, luego me dará un resultado   
    res.send(result) //el resultado podrá ser success o error   
    if(result==='error'){
        logger.error("Error al intentar modificar");
    }          
})

// DELETE borra un producto por su id
router.delete('/:id',authMiddleware,async (req,res)=>{ 
    let product_to_delete = req.params.id; //obtengo el id del producto a eliminar  
    if (persistence=='fileSystem'){
        product_to_delete= parseInt(product_to_delete)//parse para el caso de filesystem
    }    
    let result = await products.deleteById(product_to_delete); //intento borrar el producto por su id
    res.send(result)//envio los resultados, sean success o error   
    if(result==='error'){
        logger.error("Error al intentar borrar");
    }   
})

export default router