import Schema from "mongoose";
import MongoConteiner from "../../contenedores/MongoConteiner.js";

export default class CartsMongo extends MongoConteiner{
    constructor(){
        super(
            'carts',
            {
                products:{
                    type:[{
                        type:Schema.Types.ObjectId,
                        ref:'products',
                    }],
                    default:[]
                }
            },
            {timestamps:true}
        )
    }
    //creo un carrito de compras
    async createCart(){         
        try {           
            let result = await this.collection.create({products:[]})//creo el carrito con productos vacios, el timestamps ya se agrega automaticamente                   
            result.save()//guardo el carrito en la coleccion
            let cart_created = (JSON.parse(JSON.stringify(result)))//proceso el resultado de la creacion del carrito            
            return {status:'sucess', data:`Carrito creado con id: ${cart_created._id}`}//obtengo el id del carrito creado
        }catch(error){
            return {status:'error', message:error}
        }
    }
    
    //devuelve todos los productos del carrito elegido
    async getProducts(cartId_request){
        try{         
            let result = await this.collection.find({_id:cartId_request}) //busco por id en mi coleccion                            
            let cartProcessed = (JSON.parse(JSON.stringify(result))) //proceso los datos encontrados para poder manipularlos                           
            if (cartProcessed.length!=0){//si encuentro datos entonces puedo verificar los productos del carrito
                if(cartProcessed[0].products.length>0){
                    return {status:"success",data:cartProcessed[0].products}//obtengo los datos obtenidos del carrito luego de procesarlo
                }else{
                    return {status:"error",message:"El carrito aún no tiene productos"}               
                } 
            }else{
                return {status:"error",message:"Carrito no encontrado"}           
            }            
        }catch(err){
            return {status:"error",message:err}
        }
    }

    //agrega un producto (solo id) al carrito elegido
    async addProductToCart(cartId_request,productId_request){
        try{           
            let result = await this.collection.find({_id:cartId_request});//busco en mi coleccion el id solicitado
            let cartProcessed = JSON.parse(JSON.stringify(result));//proceso los datos obtenidos
            let productFind = cartProcessed[0].products.find(id=>id==productId_request); //busco en mis datos procesados si contienen el producto que intento agregar           
            if (productFind) {
                return {status:"error", message:"Producto ya agregado al carrito, no es posible añadirlo nuevamente "}//si el producto se encuentra no es posible agregarlo nuevamente
            }        
            let newProducts= [...cartProcessed[0].products,productId_request]//si no se encuentra continua la operacion, creando un array auxiliar de productos, luego este array sera el nuevo contenedor de productos
            try{
                let cart_updated = await this.collection.updateOne({_id:cartId_request},//actualizo el carrito con el nuevo arrary contenedor de productos
                    {$set:{products:newProducts}})               
                return {status:"success", message:"Producto agregado al carrito"}
            }catch{
                return {status:"error", message:"Fallo al agregar un producto al carrito"}
            }
        }catch(err){
            return {status:"error",message:"Fallo al agregar un producto al carrito"}
        }
    }

    //borra producto de un carrito
    async delProductById(cartId_request,productId_request){
        try{
            let result = await this.collection.find({_id:cartId_request});//busco el carrito de mi coleccion
            let cartProcessed = JSON.parse(JSON.stringify(result)); //proceso los datos          
            let cart_update = cartProcessed[0].products.filter((p=>p!=productId_request))// una vez obtenido el carrito , verifico por cada uno de los productos que se encuentra, si hay concidencia lo descarto, filtro.
            try{               
                let newcart_updated = await this.collection.updateOne({_id:cartId_request},//por ultimo elijo mi carrito, y actualizo su contenido, borrando asi el producto seleccionado, filtrado anteriormente
                    {$set:{products:cart_update}}) 
                return {status:"success", message:"Producto eliminado del carrito"}
            }catch{
                return {status:"error", message:"Error al eliminar producto del carrito"}
            }                  
        }catch(err){
            return {status:"error",message:err}
        }
    }
    
    //borra un carrito por su id
    async deleteCartbyId(cartId_request){       
        try{            
            let result = await this.collection.find({_id:cartId_request});//busco mi carrito en la coleccion            
            let cartProcessed = (JSON.parse(JSON.stringify(result)))  //proceso los datos                            
            if (cartProcessed.length!=0){ //verifico la cantidad de datos encontrados
                let newCarts_updated = await this.collection.deleteOne({_id:cartId_request})                              
                return {status:"success",message:"Se eliminó correctamente el carrito elegido"} //si existe datos, puedo borrar el carrito de la coleccion
            }else{
                return {status:"error",message:"No existe un carrito con el id elegigo"}//si no existen datos, es porque el carrito no esta dentro de mi coleccion           
            }         
        }catch(err){
            return {status:"error",message:"Carrito no encontrado"}
        }    
    }       
}