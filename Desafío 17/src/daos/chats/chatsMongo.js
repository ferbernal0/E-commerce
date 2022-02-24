import MongoContainer from "../../contenedores/MongoConteiner.js";
import { collectionRef, MessagesSchema } from "../modelsMongo/chats.js";
import { normalize, schema } from 'normalizr';

export default class ChatsMongo extends MongoContainer {
    constructor() {
        super(collectionRef, MessagesSchema, { timestamps: true });
    }
    
    async getAllChats(){
        try {
            let documents = await this.collection.find();
            const users = new schema.Entity('users');
            const comments = new schema.Entity('messages', { sender: users });
            const texts = new schema.Entity('posts', { messages: [ comments ] });
            const originalData = JSON.parse(JSON.stringify({ id: '1', messages: documents }))
            const normalizedData = normalize(originalData, texts)
        
            return {status: 'success',data: normalizedData};
        }catch(error){
            return {status: 'error',message: 'An error occurred: ', error}
        }
    }
};