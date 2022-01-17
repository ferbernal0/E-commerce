import MongoConteiner from "../../contenedores/MongoConteiner.js";
import { collectionRef, ProductsSchema } from "../modelsMongo/products.js";

export default class ProductsMongo extends MongoConteiner{
    constructor(){
        super(
            collectionRef,//asigno la coleccion products            
            ProductsSchema,//defino todo el esquema de los productos que se insertarán con mongo
            {timestamps:true}
        )
    }

    async updateById(productId,update){
        try {
            let result = await this.collection.updateOne({ _id: productId },{ $set: update });
            return { status: 'success', message: 'Product updated', data: result };
        } catch (error) {
            return { status: 'error', message: `No product found for ID: ${productId}` };
        };
    };
}