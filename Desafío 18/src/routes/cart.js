import express from 'express';
import __dirname from '../utils.js';
import { products,carts, persistence } from '../daos/index.js';

const cartRouter = express.Router();

//POST creacion del carrito y devuelve su id
cartRouter.post('/',async (req,res)=>{    
    let cart_created = await carts.save();    
    res.send(cart_created);
    if (cart_created.status==="success"){
        console.log(`Carrito creado con id: ${cart_created.id}`)//muestro internamente el id del carrito creado
    }    
})

//POST agrego productos al carrito 
cartRouter.post('/:id/products',async (req,res)=>{      
    let cartId_request = req.params.id;   
    let product_to_add = req.body.products;     
    if (persistence=='fileSystem'){//en caso que sea filesystem genero el id numerico, es por eso que luego parseo a numero
        cartId_request = parseInt(cartId_request);
        product_to_add = parseInt(req.body.products);
    } 
    //consulto si existe el producto que se intenta agregar
    let prodExist = await products.getById(product_to_add);    
    if (prodExist.status!='error'){ //si no hay errores, significa que el producto esta dado de "alta" dentro de la coleccion products y puede ser guardado en el carrito
        let result = await carts.addProductToCart(cartId_request,product_to_add);        
        res.send(result);
    } else {
        res.status(404).send({error:'Id de producto no valido, este producto no existe'})
    }
})

//GET muestra un carrito especifico por ID con sus productos
cartRouter.get('/:id/products',async (req,res)=>{   
    let cartId_request= req.params.id;   
    if (persistence=='fileSystem'){
        cartId_request= parseInt(cartId_request);
    }        
    let {data, message} = await carts.getById(cartId_request);//obtengo los productos del carrito          
    if (!message){//si no existe un mensaje es porque los datos se encontraron para ser procesados
        res.send(data);//envio los datos encontrados
    }else {
        res.status(404).send({error: message});//si existe un mensaje lo muestro, los mensajes se muestran porque se encontraron errores en el proceso
    }
})

//DELETE borra un carrito especifico
cartRouter.delete('/:id',async (req,res)=>{ 
    let cartId_request = req.params.id;      
    if (persistence=='fileSystem'){
        cartId_request= parseInt(cartId_request);
    }    
    let findCart = await carts.getById(cartId_request)    
    if (findCart.status =='Error') { 
        res.send(findCart)
    } else {
        let result = await carts.deleteById(cartId_request);//envio el id del carrito a borrar    
        res.send(result);    
    }
})

//DELETE borra productos(id_prod) de un carrito(id)
cartRouter.delete('/:id/products/:id_prod',async (req,res)=>{      
    let cartId_request = req.params.id;  
    let prodId_request= req.params.id_prod;
    if (persistence=='fileSystem'){
        cartId_request = parseInt(req.params.id);   
        prodId_request= parseInt(req.params.id_prod); 
    }    
    let {data,message} = await carts.getById(cartId_request);  //obtengo los productos del carrito antes de ejecutar el borrado         
    if (!message){//si no se envio un mensaje entonces existen datos para poder procesar                
        let product_found =JSON.parse(JSON.stringify(data.products))
        let result_found = product_found.find(prod=>prod===prodId_request);//busco el product ID dentro del array de productos        
        if (result_found){//si encuentro un producto, ejecuto la operacion de borrado del mismo
            let result = await carts.delProductById(cartId_request,prodId_request);           
            res.send(result);
        } else{//en caso que no exista un producto a borrar no ejecuto el borrado
            res.status(404).send({error:'Este producto no existe en el carrito'});
        }                    
    }else {
        res.status(404).send({error: message});    
    }
})

export default cartRouter