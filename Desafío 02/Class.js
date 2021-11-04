const fs = require('fs');
const save = require('./save');

class Contenedor {
    async crearProducto(prod){
        try{
            let data = await fs.promises.readFile('./productos.txt', 'utf-8')
            let products = JSON.parse(data);
            if(products.some(prd=>prd.title===prod.title)){
                return {status:"error",message:"El producto ya existe."}
            }else{
                let prObj = {
                    id:save(8),
                    title:prod.title,
                    price:prod.price,
                    thumbnail:prod.thumbnail
                }
                products.push(prObj);
                try{
                    await fs.promises.writeFile('./productos.txt',
                    JSON.stringify(products,null,2));
                    return {status:"success",message:"Producto Creado exitosamente."}
                }catch(err){
                    return {status:"error",message:"El producto no pudo ser creado."}
                }
            }    
        }catch{
            let prObj = {
                id:save(8),
                title:prod.title,
                price:prod.price,
                thumbnail:prod.thumbnail
            }
            try{
                await fs.promises.writeFile('./productos.txt',
                JSON.stringify([prObj],null,2))
                    return {status:"success",message:"Producto Creado exitosamente."}
                }catch(err){
                    return {status:"error",message:"El producto no pudo ser creado."+error}
                }
            }    
        }
        async getAll(){
            try{
                let data = await fs.promises.readFile('./productos.txt','utf-8')
                let products = JSON.parse(data);
                let product = products.map(prd=>prd);
                if(product){
                    return {status:"success",product:product}
                }else{
                    return {status:"error",product:null,message:"Info NO obtenida."}
                }
            }catch(err){
                return {status:"error",message:"No se procesar la solicitud."+err}
            }
        }
        async getById(id){
            try{
                let data = await fs.promises.readFile('./productos.txt','utf-8')
                let products = JSON.parse(data);
                let product = products.find(prd=>prd.id===id);
                if(product){
                    return {status:"success",product:product}
                }else{
                    return {status:"error",product:null,message:"Producto no encontrado"}
                }
            }catch(err){
                return {status:"error",message:"No se encontro el producto."}
            }
        }
        async deleteAll(){
            try{
                await fs.promises.unlink('./productos.txt')
                return {status:"success",message:"Objetos elimiandos."}
            }catch(error){
                return {status:"error",message:"No se encuentran los objetos."+error}
            }
        }
        async deleteById(id){
            try{
                let data = await fs.promises.readFile('./productos.txt','utf-8')
                let products = JSON.parse(data);
                let product = products.find(prd=>prd.id===id);
                if(product){
                    try{
                        let prodObj = products.filter(prd => prd.id !== id);
                        products.splice(prodObj);
                        await fs.promises.writeFile('./productos.txt',
                        JSON.stringify([prodObj],null,2))
                            return {status:"success",message:`Producto "${id}" eliminado.`}
                        }catch(err){
                            return {status:"error",message:`"${id} no encontrado."`+error}
                        }
                    }else{
                    return {status:"error",message:`Producto con ID "${id} no encontrado.`}
                }
            }catch(err){
                return {status:"error",message:"No se encontro el producto."}
            }
        }
}

module.exports = Contenedor;