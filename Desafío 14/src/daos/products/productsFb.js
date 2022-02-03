import FbConteiner from "../../contenedores/FbConteiner.js";
import admin from 'firebase-admin'

export default class ProductsFb extends FbConteiner{
    constructor(){
        super(
            'products'//asigno la coleccion products
        )        
    }
    async save(product_to_create){        
        try {           
            let result = await this.currentCollection.get() //obtengo la coleccion
            let products = result.docs
            const productsProcessed = products.map(document=>document.data())// proceso cada dato de la coleccion           
            if (productsProcessed.some(prod=>prod.title===product_to_create.title)){ //consulto si dentro de los datos procesados tengo algun producto con el mismo titulo
                return {status:"error",message:"Producto existente, no es posible agregar otro producto igual"} // en caso de existir no se continua la operacion de agregado, por estar duplicado
            }                         
            let timestamp = admin.firestore.Timestamp.now()// creo un timestamp
            product_to_create.timestamp = timestamp // lo agrego al producto que se intenta crear
            let product_added = this.currentCollection.doc()
            await product_added.set(product_to_create)//agrego a mi coleccion el producto que intentaba crear           
            return {status:'sucess', data:`Producto creado con id: ${product_added.id} `}//por ultimo muestro el id con el que se creó el producto
        }catch(error){
            return {status:'error', message:error}
        }
    }

    //este metodo se utiliza para buscar un producto por su id
    async getById(productId_request){
        try{            
            let result = this.currentCollection.doc(productId_request)// busco en mi coleccion el id del producto 
            let product = await result.get();
            let productProcessed = product.data()//proceso los datos que encontre             
            if (productProcessed){//si esos datos existen entonces puedo enviar los datos del productos solicitado
                productProcessed.id = productId_request // solo para una facil lectura le agrego el id al producto encontrado 
                return {status:"success",data:productProcessed}//envio los datos del producto
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
            let result = await this.currentCollection.get()//busco los productos de toda la coleccion
            let product = result.docs;
            let productProcessed = product.map(document =>{//por cada producto encontrado ejecuto el mapeo
                let newDoc = document.data()//proceso los datos
                newDoc.id= document.id //luego agrego el id a los datos del producto encontrado
                return newDoc;//devuelvo ese nuevo producto, conteniendo su id
            })                                     
            if (productProcessed.length==0){ // si el tamaño de los datos procesados es cero, entonces no tenia productos la coleccion
                return {status:"error",message:"No se encontraron productos"}           
            }else{                
                return {status:"success",data:productProcessed}//envio todos los productos encontrados
            }            
        }catch(err){
            return {status:"error", message:err}
        }
    }

    //metodo utilizado para actualizar caracteristicas del producto, se requiere ID y el producto
    async updateProduct(productId_request,product_to_update){    
        try{
            let result = this.currentCollection.doc(productId_request)  //busco en la colección el producto que intento actualizar  
            let product = await result.get();
            let productProcessed = product.data()//proceso el dato obtenido                      
            try{
                if(!productProcessed){//si no existe el dato, entonces no hay producto con ese id, finalizo la operación                    
                    return {status:"error", message:"No hay un producto con el id elegido"}
                }else { 
                    await result.update({//si existe el producto entonces tomo los valores del producto que intento actualizar y los actualizo con los datos que se capturaron
                        title:      product_to_update.title,
                        description:product_to_update.description,
                        code:       product_to_update.code,
                        thumbnail:  product_to_update.thumbnail,
                        price:      product_to_update.price,
                        stock:      product_to_update.stock,
                        timestamp:  admin.firestore.Timestamp.now()})
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
            let result = this.currentCollection.doc(productId_request)// busco en mi coleccion el id del producto a eliminar       
            let product = await result.get();
            let productProcessed = product.data()//proceso los datos obtenidos             
            if (productProcessed){//si los datos existen, entonces puedo continuar la operacion y eliminar el producto                
                await result.delete()//elimino el producto
                return {status:"success",message:"Se eliminó el producto elegido"} 
            }else{
                return {status:"error",message:"No había productos para eliminar"}           
            }         
        }catch(err){
            return {status:"error",message:"Producto no encontrado"}
        }
    }
}