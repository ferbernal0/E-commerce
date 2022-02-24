import FbConteiner from "../../contenedores/FbConteiner.js";
import admin from 'firebase-admin';

export default class CartsFb extends FbConteiner{
    constructor(){
        super(
            'carts'
        )        
    }
    //creo un carrito
    async createCart(){         
        try {            
            let result = this.currentCollection.doc();
            await result.set({products:[],timestamp:admin.firestore.Timestamp.now()}); //agrego el timestamp al carrito que estoy creando                               
            return {status:'sucess', data:`Carrito creado con id: ${result.id}`}//tomo el id del resultado de la creacion del carrito
        }catch(error){
            return {status:'error', message:error}
        }
    }
    
    // //devuelve todos los productos del carrito elegido
    async getProducts(cartId_request){        
        try{         
            let result = this.currentCollection.doc(cartId_request);//busco el id del carrito solicitado                            
            let cart = await result.get();
            let cartProcessed = cart.data();//proceso los datos obtenidos para poder manipularlos                 
            if (cartProcessed){//si existen los datos es porque existe el carrito, de lo contrario no existe en la coleccion un carrito con ese id
                if(cartProcessed.products.length>0){//si existe el carrito, verifico el contenido del array productos, si su tamaño es mayor a cero, entonces tiene productos
                    return {status:"success",data:cartProcessed.products}
                }else{
                    return {status:"error",message:"El carrito aún no tiene productos"}//si el tamaño del array productos es cero entonces no tiene productos               
                } 
            }else{
                 return {status:"error",message:"Carrito no encontrado"}           
            }            
        }catch(err){
            return {status:"error",message:err}
        }
    }

    // //agrega un producto (solo id) al carrito elegido
    async addProductToCart(cartId_request,productId_request){
        try{           
            let result = this.currentCollection.doc(cartId_request)//busco el carrito por su id , cartId_request
            let cart = await result.get();
            let cartProcessed = cart.data() //proceso los carritos entoncontrados para poder manipularlos
            let productFind = cartProcessed.products.find(id=>id==productId_request);//consulto si el producto a agregar (productId_request) esta dentro de los productos del carrito seleccionado             
            if (productFind) { // si encontro el producto en el carrito, no es posible continuar la operacion, evitando duplicado 
                return {status:"error", message:"Producto ya agregado al carrito, no es posible añadirlo nuevamente "}
            } 
            let newProducts= [...cartProcessed.products,productId_request] // si no esta el producto dentro del carrito, agrego ese producto a un array auxiliar, que contendrá todos los productos y el nuevo a agregar         
            try{
                let cart_updated = await result.update({products:newProducts})//finalmente actualizo el contenedor de productos con mi contenedor auxiliar.             
                return {status:"success", message:"Producto agregado al carrito"}
            }catch{
                return {status:"error", message:"Fallo al agregar un producto al carrito"}
            }
        }catch(err){
            return {status:"error",message:"Fallo al agregar un producto al carrito"}
        }
    }

    // //borra producto de un carrito
    async delProductById(cartId_request,productId_request){
        try{
            let result = this.currentCollection.doc(cartId_request) //busco el carrito cartId_request
            let cart = await result.get();
            let cartProcessed = cart.data()//proceso la informacion para manipular el carrito encontrado
            let products_update = cartProcessed.products.filter((p=>p!=productId_request)) // dentro de los productos del carrito encontrado, filtro en un nuevo array el productId_request, dejando el resto de productos
            try{               
                let cart_updated = await result.update({products:products_update}) // por ultimo asigno ese nuevo product_update con los productos a mi carrito seleccionado.
                return {status:"success", message:"Producto eliminado del carrito"}
            }catch{
                return {status:"error", message:"Error al eliminar producto del carrito"}
            }                  
        }catch(err){
            return {status:"error",message:err}
        }
    }
    
    // //borra un carrito por su id
    async deleteCartbyId(cartId_request){       
        try{                                                
            let result = this.currentCollection.doc(cartId_request)//busco en mi coleccion el cartId_request
            let cart = await result.get();
            let cartProcessed = cart.data()//proceso esta informacion para consulta si existe el carrito buscado
            if (cartProcessed){//si existe entonces podemos eliminarlo
                let newCarts_updated = await result.delete()//se elimina el carrito seleccionado                              
                return {status:"success",message:"Se eliminó correctamente el carrito elegido"} 
            }else{
                return {status:"error",message:"No existe un carrito con el id elegigo"}//en caso que no exista el carrito no se realiza la operacion de borrado           
            }         
        }catch(err){
            return {status:"error",message:"Carrito no encontrado"}
        }    
    }       

}
