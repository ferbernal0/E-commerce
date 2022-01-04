import mongoose  from "mongoose";
import config from '../config.js'

//conexion de mongo
mongoose.connect(config.mongo.baseUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true
})

//creo una clase padre, donde recibira los esquemas de sus hijos, las colecciones y un timestamp
export default class MongoConteiner{
    constructor(collection,schema,timestamps){
        this.collection = mongoose.model(collection,new mongoose.Schema(schema,timestamps))
    }  
}
