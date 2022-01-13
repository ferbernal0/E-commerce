import fs from 'fs'

class Conteiner{    
    constructor(fileName){
        this.fileName=fileName
    }
    // metodo utilizado para guardar un producto y devolver el id, el producto es ingresado como un {}
    async save(product){         
        try{
            let data =await fs.promises.readFile(this.fileName,'utf-8');
            let products =JSON.parse(data); 
            let nuevoId = products[products.length-1].id+1;
            if (products.some(prod=>prod.title===product.title)){ 
                return {status:"error",message:"Producto existente"}
            }else{
                let timestamp = Date.now();
                let time = new Date(timestamp);
                let prodObj = {                    
                    timestamp:time,
                    title:product.title,
                    description:product.description,
                    code:product.code,
                    thumbnail:product.thumbnail,
                    price:product.price,
                    stock:product.stock,
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
            let timestamp = Date.now();
            let time = new Date(timestamp);
            let prodObj = {                
                timestamp:time,
                title:product.title,
                description:product.description,
                code:product.code,
                thumbnail:product.thumbnail,
                price:product.price,
                stock:product.stock,
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
    //este metodo se utiliza para buscar un producto por su id
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
    //metodo para devolver todos los productos del archivo guardado
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
    //metodo utilizado para actualizar caracteristicas del producto, se requiere ID y el producto
    async updateProduct(id,productSelect){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let products = JSON.parse(data);                        

            if(!products.some(product=>product.id===id)) return {status:"error", message:"No hay un producto con el id elegido"}
            let result = products.map(product=>{                
                if(product.id===id){                     
                    productSelect = Object.assign(productSelect,{title:productSelect.title,description:productSelect.description,code:productSelect.code,thumbnail:productSelect.thumbnail,price:productSelect.price,stock:productSelect.stock})                    
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
    //permite borrar un producto por su numero de id
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
}

export default Conteiner