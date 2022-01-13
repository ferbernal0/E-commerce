import MongoConteiner from "../../contenedores/MongoConteiner.js";

export default class ProductsMongo extends MongoConteiner{
    constructor(){
        super(
            'products',//asigno la coleccion products
            {//defino todo el esquema de los productos que se insertarán con mongo
                title:{type:String,unique:true,required:true},
                description:{type:String,required:true},
                code:{type:String,required:true},
                thumbnail:{type:String,required:true},
                price:{type:Number,required:true},
                stock:{type:Number,required:true}
            },
            {timestamps:true}
        )
    }

    //metodo utilizado para guardar un producto
    async save(product_to_create){         
        try {            
            let product_found = await this.collection.find({title:product_to_create.title})//primero busco por titulo si dentro de la coleccion ya estaba ese producto                 
            if (product_found.length!=0) return {status:"error",message:"Producto existente, no es posible agregar otro producto igual"}//si existe el producto no se puede continuar la operacion de creacion
            let product_created = await this.collection.create(product_to_create)//si no hay producto se puede crear un producto            
            product_created.save()//guardo el producto
            let productProcessed = (JSON.parse(JSON.stringify(product_created)))//proceso el producto para poder manipularlo            
            return {status:'sucess', data:`Producto creado con id: ${productProcessed._id}`}//obtengo el id del producto procesado
        }catch(error){
            return {status:'error', message:error}
        }
    }
   
    //este metodo se utiliza para buscar un producto por su id
    async getById(productId_request){
        try{            
            let result = await this.collection.find({_id:productId_request})// busco en mi coleccion el id del producto                           
            let productProcessed = (JSON.parse(JSON.stringify(result)))//proceso el producto para poder manipularlo                       
            if (productProcessed.length!=0){//si tiene productos procesados su tamaño es distinto de cero, existe algo
                return {status:"success",data:productProcessed}//envio esos datos encontrados
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
            let result = await this.collection.find();//obtengo todos los productos de mi coleccion             
            let productsProcessed = (JSON.parse(JSON.stringify(result)))//proceso los datos obtenidos                 
            if (productsProcessed.length==0){//verifico la cantidad de productos                
                return {status:"error",message:"No se encontraron productos"}// si lenght es cero no hubo productos           
            }else{                
                return {status:"success",data:productsProcessed}//si hay productos los envio 
            }            
        }catch(err){
            return {status:"error", message:err}
        }
    }

    //metodo utilizado para actualizar caracteristicas del producto, se requiere ID y el producto
    async updateProduct(productId_request,product_to_update){
        try{
            let result = await this.collection.find({_id:productId_request})//busco el id del producto elegido    
            let productsProcessed = (JSON.parse(JSON.stringify(result))) //proceso los datos para manipularlos            
            try{
                if(productsProcessed.length==0){//pregunto por la cantidad de datos encontrados                    
                    return {status:"error", message:"No hay un producto con el id elegido"}//si es cero no se continua, porque no hay productos
                }else { 
                    let newProduct = await this.collection.updateOne({_id:productId_request},//preparo el producto para actualizar, obteniendo los valores que se ingresaron
                        {$set:{
                            title:product_to_update.title,
                            description:product_to_update.description,
                            code:product_to_update.code,
                            thumbnail:product_to_update.thumbnail,
                            price:product_to_update.price,
                            stock:product_to_update.stock}})                                                          
                    return {status:"success", message:"Producto actualizado"}
                    }                   
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(err){
            return {status:"error",message:"Fallo al actualizar el producto"}
        }        
    }

    //permite borrar un producto por su numero de id
    async deletebyId(productId_request){
        try{
            let result= await this.collection.find({_id:productId_request}); //busco en mi coleccion el id del producto solicitado
            let productProcessed = (JSON.parse(JSON.stringify(result))) //proceso el resultado para poder manipularlo                             
            if (productProcessed.length!=0){//si encontre un producto procedo a eliminarlo
                let products = await this.collection.deleteOne({_id:productId_request})                              
                return {status:"success",message:"Se eliminó el producto elegido"} 
            }else{
                return {status:"error",message:"No había productos para eliminar"}//de lo contrario no habia producto que eliminar           
            }         
        }catch(err){
            return {status:"error",message:"Producto no encontrado"}
        }
    }
}