import Schema from "mongoose";
import MongoConteiner from "../../contenedores/MongoConteiner.js";
import { collectionRef,CartsSchema} from "../modelsMongo/carts.js";

export default class CartsMongo extends MongoConteiner{
    constructor(){
        super(
            collectionRef,
            CartsSchema,
            {timestamps:true}
        )
    }
   
    async addProductToCart(cartId_request, productId_request){
        let result = await this.collection.find({_id:cartId_request});//busco en mi coleccion el id solicitado
        let cartProcessed = JSON.parse(JSON.stringify(result));//proceso los datos obtenidos
        let productFind = cartProcessed[0].products.find(id=>id==productId_request); //busco en mis datos procesados si contienen el producto que intento agregar           
        if (productFind) {
            return {status:"error", message:"Producto ya agregado al carrito, no es posible añadirlo nuevamente "}//si el producto se encuentra no es posible agregarlo nuevamente
        }        
        try {
            let result = await this.collection.updateOne({ _id: cartId_request }, { $push: { products: productId_request } });
            return { status: 'success', message: 'Item added to cart', data: result };
        } catch (error) {
            return { status: 'error', message: `No cart found with ID: ${cartId_request}` };
        };
    };
    
    async delProductById(cartId_request, productId_request){
        try {
            let cart = { _id: cartId_request };
            let query = { 
                $pull: {
                products: { $in: [ productId_request ] }
            }
        };
        let result = await this.collection.updateOne(cart, query);
            return { status: 'success', message: 'Item removed from cart', data: result };
        } catch (error) {
            return { status: 'error', message: 'Could not remove item from cart' };
        };
    };
}