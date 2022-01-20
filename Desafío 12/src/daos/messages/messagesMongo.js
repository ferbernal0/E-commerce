import MongoConteiner from "../../contenedores/MongoConteiner.js";
import { collectionRef,MessagesSchema} from "../modelsMongo/messages.js";

export default class MessagesMongo extends MongoConteiner{
    constructor(){
        super(
            collectionRef,
            MessagesSchema,
            {timestamps:true}
        )
    }   
}