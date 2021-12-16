import express from 'express';
import Conteiner from '../classes/Conteiner.js';
import Cart from '../classes/Cart.js';
import __dirname from '../utils.js';

const cartRouter = express.Router();
const PATH = __dirname+'/files/cartList.json';
const PRODUCTSPATH = __dirname+'/files/productsList.json';
const conteiner = new Conteiner(PRODUCTSPATH);
const cart = new Cart(PATH);

//POST creacion del carrito y devuelve su id
cartRouter.post('/',async (req,res)=>{          
    let idCart = await cart.createCart();
    res.send(idCart);
    if (idCart.status==="success"){
        console.log(`carrito creado con id: ${idCart.id}`)
    }    
})

//POST agrego al carrito 
cartRouter.post('/:id/products',async (req,res)=>{      
    let idReq = parseInt(req.params.id);     
    let prodId = parseInt(req.body.products);    
    //consulto si existe el producto que se intenta agregar
    let prodExist = await conteiner.getById(prodId);     
    if (prodExist.status!='error'){   
        let result = await cart.addProductToCart(idReq,prodId);
        res.send(result)
    } else {
        res.status(404).send({error:'Id de producto no valido, este producto no existe'})
    }
})

//GET muestra un carrito especifico por ID con sus productos
cartRouter.get('/:id/products',async (req,res)=>{   
    let idReq = parseInt(req.params.id);    
    let {data, message} = await cart.getProducts(idReq);          
    if (!message){
        res.send(data)
    }else {
        res.status(404).send({error: message})    
    }
})

//DELETE borra un carrito especifico
cartRouter.delete('/:id',async (req,res)=>{ 
    let idReq = parseInt(req.params.id);    
    let data = await cart.deleteCartbyId(idReq);
    res.send(data)    
})


//DELETE borra productos(id_prod) de un carrito(id)
cartRouter.delete('/:id/products/:id_prod',async (req,res)=>{ 
    let cart_id = parseInt(req.params.id);   
    let prod_id= parseInt(req.params.id_prod);     
    let {data,message} = await cart.getProducts(cart_id);    
    if (!message){                
        let prodFind = data.find(prod=>prod===prod_id);        
        if (prodFind){
            let result = await cart.delProductById(cart_id,prod_id);
            res.send(result)
        } else{
            res.status(404).send({error:'Este producto no existe en el carrito'})
        }                      
    }else {
        res.status(404).send({error: message})    
    }
})

export default cartRouter