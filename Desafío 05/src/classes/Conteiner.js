const fs = require('fs');

class Conteiner{    
    constructor(fileName){
        this.fileName=fileName
    }
    
    async save(product){         
        try{
            let data =await fs.promises.readFile(this.fileName,'utf-8');
            let products =JSON.parse(data); 
            let nuevoId = products[products.length-1].id+1;  

            if (products.some(prod=>prod.title===product.title)){ 
                return {status:"error",message:"Producto existente"}

            }else{
                let prodObj = {
                    title:product.title,
                    price:product.price,
                    thumbnail:product.thumbnail,
                    id:nuevoId,
                }                                
                products.push(prodObj);
                try{
                    await fs.promises.writeFile(this.fileName,JSON.stringify(products,null,2));                                        
                    return {status:"success",message:"Producto agregado",id:prodObj.id}

                }catch(err){
                    return {status:"error",message:"No se pudo agregar el producto"}
                }
            }             
        }catch{
            let prodObj = {
                title:product.title,
                price:product.price,
                thumbnail:product.thumbnail,
                id:1,
            }    
            try {
                await fs.promises.writeFile(this.fileName,JSON.stringify([prodObj]),null,2) 
                return {status:"success",message:"Producto agregado",id:prodObj.id}

            }catch(err){
                return {status:"error",message:"No se pudo crear el archivo"}
            }
        }
    }
  
    async getById(numberId){
        try{            
            let data = await fs.promises.readFile(this.fileName,'utf-8');            
            let products = JSON.parse(data);            
            let prod = products.find(prod=>prod.id===numberId);            
            if (prod){
                return {status:"success",data:prod}
            }else{
                return {status:"error",message:"Producto no encontrado"}           
            }            
        }catch(err){
            return {status:"error",message:err}
        }
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
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

    async updateProduct(id,productSelect){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let products = JSON.parse(data);                        

            if(!products.some(product=>product.id===id)) return {status:"error", message:"No hay un producto con el id elegido"}
            let result = products.map(product=>{                
                if(product.id===id){                     
                    productSelect = Object.assign(productSelect,{title:productSelect.title,price:productSelect.price,thumbnail:productSelect.thumbnail})                    
                    productSelect = Object.assign({...productSelect,id:product.id})                    
                    return productSelect                    
                }else{                   
                    return product;
                }
            })            
            try{
                await fs.promises.writeFile(this.fileName,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(err){
            return {status:"error",message:"Fallo al actualizar el usuario"}
        }
    }
    
    async deletebyId(numberId){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let products = JSON.parse(data); 
            let prod = products.find(prod=>prod.id===numberId);
            if (prod){
                let newProducts = products.filter((p)=>p.id!=numberId)                           
                await fs.promises.writeFile(this.fileName,JSON.stringify(newProducts),null,2)                 
                return {status:"success",message:"Se eliminó el producto elegido"} 
            }else{
                return {status:"error",message:"No había productos para eliminar"}           
            }         
        }catch(err){
            return {status:"error",message:err}
        }
    }
    
    async deleteAll(){
        try{
            await fs.promises.writeFile(this.fileName,JSON.stringify(''),null,2);
            return {status:"success",message:"Todos los productos fueron eliminados"}         
        }catch(err){
            return {status:"error",message:err}
        }
    }
}


module.exports = Conteiner