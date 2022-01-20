import FileConteiner from "../../contenedores/FileConteiner.js";
import fs from 'fs'
import __dirname from '../../utils.js';

export default class ProductsFileSystem extends FileConteiner{
    constructor(){
        super('productsList.json');//envio el nombre del archivo que tiene mis productos
    }
    
    async save(product_to_create){         
        try{
            let data =await fs.promises.readFile(this.url,'utf-8');
            let products =JSON.parse(data); 
            let nuevoId = products[products.length-1].id+1;
            if (products.some(prod=>prod.title===product_to_create.title)){ 
                return {status:"error",message:"Producto existente"}
            }else{
                let timestamp = Date.now();
                let time = new Date(timestamp);
                let prodObj = {                    
                    timestamp:time,
                    title:product_to_create.title,
                    description:product_to_create.description,
                    code:product_to_create.code,
                    thumbnail:product_to_create.thumbnail,
                    price:product_to_create.price,
                    stock:product_to_create.stock,
                    id:nuevoId,
                }                                
                products.push(prodObj);
                try{
                    await fs.promises.writeFile(this.url,JSON.stringify(products,null,2));                                        
                    return {status:"success",message:"Producto agregado",id:prodObj.id}

                }catch(err){
                    return {status:"error",message:"No se pudo agregar el producto"}
                }
            }             
        }catch{             
            let timestamp = Date.now();
            let time = new Date(timestamp);
            let prodObj = {                
                timestamp:time,
                title:product_to_create.title,
                description:product_to_create.description,
                code:product_to_create.code,
                thumbnail:product_to_create.thumbnail,
                price:product_to_create.price,
                stock:product_to_create.stock,
                id:1,
            }    
            try {
                await fs.promises.writeFile(this.url,JSON.stringify([prodObj]),null,2) 
                return {status:"success",message:"Producto agregado",id:prodObj.id}

            }catch(err){
                return {status:"error",message:"No se pudo crear el archivo"}
            }
        }
    }
    //este metodo se utiliza para buscar un producto por su id
    async getById(productId_request){
        try{            
            let data = await fs.promises.readFile(this.url,'utf-8');            
            let products = JSON.parse(data);            
            let prod = products.find(prod=>prod.id===productId_request);            
            if (prod){
                return {status:"success",data:prod}
            }else{
                return {status:"error",message:"Producto no encontrado"}           
            }            
        }catch(err){
            return {status:"error",message:err}
        }
    }
    //metodo para devolver todos los productos del archivo guardado
    async getAll(){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let products = JSON.parse(data);            
            if (products){
                return {status:"success",data:products}
            }else{
                return {status:"error",message:"No se encontraron productos"}           
            }            
        }catch(err){
            return {status:"error", message:err}
        }
    }
    //metodo utilizado para actualizar caracteristicas del producto, se requiere ID y el producto
    async updateProduct(productId_request,product_to_update){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let products = JSON.parse(data);    
            if(!products.some(product=>product.id===productId_request)) return {status:"error", message:"No hay un producto con el id elegido"}
            let result = products.map(product=>{                
                if(product.id===productId_request){                     
                    product_to_update = Object.assign(product_to_update,{
                        title:product_to_update.title,
                        description:product_to_update.description,
                        code:product_to_update.code,
                        thumbnail:product_to_update.thumbnail,
                        price:product_to_update.price,
                        stock:product_to_update.stock})                    
                        product_to_update = Object.assign({...product_to_update,id:product.id})                    
                    return product_to_update                    
                }else{                   
                    return product;
                }
            })            
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(err){
            return {status:"error",message:"Fallo al actualizar el usuario"}
        }
    }
    //permite borrar un producto por su numero de id
    async deletebyId(productId_request){
        try{
            let result = await fs.promises.readFile(this.url,'utf-8');
            let products = JSON.parse(result); 
            let prod = products.find(prod=>prod.id===productId_request);
            if (prod){
                let newProducts = products.filter((p)=>p.id!=productId_request)                           
                await fs.promises.writeFile(this.url,JSON.stringify(newProducts),null,2)                 
                return {status:"success",message:"Se eliminó el producto elegido"} 
            }else{
                return {status:"error",message:"No había productos para eliminar"}           
            }         
        }catch(err){
            return {status:"error",message:err}
        }
    }
}