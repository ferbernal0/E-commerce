import MongoConteiner from "../../contenedores/MongoConteiner.js";
import { collectionRef, UsersSchema } from "../modelsMongo/users.js";

export default class UsersMongo extends MongoConteiner{
    constructor(){
        super(
            collectionRef,//asigno la coleccion products            
            UsersSchema,//defino todo el esquema de los productos que se insertarán con mongo
            {timestamps:true}
        )
    }    
    async getByEmail(email){
        try {
            let document = await this.collection.findOne({email: email});    
        if (!document)
            return { status: 'Error', message: `No se encontro el email: ${email}` };
    
        return { status: 'success', data: document };
        } catch (error) {
            return { status: 'error', message: 'Hubo un error durante la operacion: ', error };
        }
    }

    async getByUserName(username){
        try {
            let document = await this.collection.findOne({username: username});    
        if (!document)
            return { status: 'Error', message: `No se encontro el usuario: ${username}` };
    
        return { status: 'success', data: document };
        } catch (error) {
            return { status: 'error', message: 'Hubo un error durante la operacion: ', error };
        }
    }

    async updateAvatar(email,avatarPicture){
        try {            
            let result = await this.collection.updateOne({ email: email }, { $set: { avatar: avatarPicture } });
            return { status: 'success', message: 'Se modifico url de avatar', data: result };
        } catch (error) {
            return { status: 'error', message: `no se encontro email: ${email}` };
        };
    }
}