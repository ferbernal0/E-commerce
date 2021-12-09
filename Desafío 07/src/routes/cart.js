import express from 'express';
import Conteiner from '../classes/Conteiner.js';
import Cart from '../classes/Cart.js';
import __dirname from '../utils.js';
import {io} from '../server.js'
import { authMiddleware } from '../utils.js';

const cartRouter = express.Router();
const PATH = __dirname+'/files/cartList.json';
const PRODUCTSPATH = __dirname+'/files/productsList.json';
const conteiner = new Conteiner(PRODUCTSPATH);
const cart = new Cart(PATH);
let idCart = null


//POST creacion del carrito y devuelve su id
cartRouter.post('/',async (req,res)=>{          
    idCart = await cart.createCart() 
    res.send(idCart)      
    if (idCart.status==="success"){
        console.log(`carrito creado con id: ${idCart.id}`)
    }    
})

//INCOMPLETO
//POST agrego al carrito 
cartRouter.post('/:id/products',async (req,res)=>{      
    let idReq = parseInt(req.params.id); 
    console.log(`èste es id ${idReq}`)
    let prodId = parseInt(req.body)
    console.log(`esto es body ${prodId}`)
    // let {data} = await conteiner.getById(idReq);    
    // let cartUpdate = await cart.addProductToCart(idCart,data)    
    // if(data) {
    //     res.send(data)        
    // } else {
    //     res.status(404).send({error:'CARRITO no encontrado'})
    // }        
})

//GET muestra todos los carritos con sus productos
cartRouter.get('/',async (req,res)=>{    
    let {data} = await cart.getAllCart();
    res.send(data)
})


//GET muestra un carrito especidifo por ID con sus productos
cartRouter.get('/:id/products',async (req,res)=>{   
    let idReq = parseInt(req.params.id);    
    let {data} = await cart.getProducts(idReq);          
    if(data) {
        res.send(data.products)
    } else {
        res.status(404).send({error:'carrito no encontrado'})
    }
})

//DELETE borra un carrito especifico
cartRouter.delete('/:id',async (req,res)=>{ 
    let idReq = parseInt(req.params.id);
    let data = await cart.deleteCartbyId(idReq);
    res.send(data)    
})

//INCOMPLETO
//DELETE borra productos(id_prod) de un carrito(id)
cartRouter.delete('/:id/products/:id_prod',async (req,res)=>{ 
    let cart_id = parseInt(req.params.id);
    let prod_id= parseInt(req.params.id_prod);
    //usar metodo modificar/actualizar carrito    

    // let data = await cart.deleteCartbyId(idReq);
    // res.send(data)    
})

export default cartRouter