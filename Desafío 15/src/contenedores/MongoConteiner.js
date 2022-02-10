import mongoose  from "mongoose";
import config from '../config.js'

//conexion de mongo
mongoose.connect(config.mongo.baseUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

//creo una clase padre, donde recibira los esquemas de sus hijos, las colecciones y un timestamp
export default class MongoConteiner{  
    constructor(collection, schema) {
        const mongoSchema = new mongoose.Schema(schema, { timestamps: true })
        mongoSchema.set('toJSON',{
            transform: (document, returnedObject) => {
                returnedObject.id = returnedObject._id
                delete returnedObject.__v
            }
        })
        this.collection = mongoose.model(collection, mongoSchema)
    }
    
    async getAll(){
        try{
            let documents = await this.collection.find();
            return {status:'success',data:documents};
        }catch(error){
            return { status:'error',message:'Hubo un error durante la operacion: ',error};
        }
    }
    
     
    async getById(id){
        try{
            let document = await this.collection.findOne({_id: id});    
        if (!document)
            return {status:'error',message: `No se encontro el id: ${id}`};
    
        return { status:'success',data:document};
        }catch(error){
            return { status:'error',message:'Hubo un error durante la operacion: ',error};
        }
    }
    
    async save(object){
        try{
            let result = await this.collection.create(object);
            return {status:'success',message:'Operacion realiza correctamente',data:result};
        }catch(error){
            return {status:'error',message: 'Hubo un error durante la operacion: ',error};
        }
    }
    
    async deleteById(id){
        try{
            let result = await this.collection.find({_id:id})          
            let document = await this.collection.deleteOne({ _id:id});

            return {status:'success',message:'Eliminado correctamente',data:document};
        }catch(error){
            return {status:'error',message:'Ocurrio un error: ',error};
        }
    }
}
