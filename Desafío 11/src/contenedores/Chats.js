import fs from 'fs'

class Chats{    
    constructor(fileName){
        this.fileName=fileName
    }
    //guarda los chats en un archivo
    async saveChats(user_chat){       
        try{
            let users_chatsSaved =await fs.promises.readFile(this.fileName,'utf-8');            
            let chats_processed =JSON.parse(users_chatsSaved);          
            let nuevoId = chats_processed[chats_processed.length-1].id+1; 
            let chatObj = {
                    // email:user_chat.email,
                    // date:user_chat.date,
                    // message:user_chat.message,
                    id:nuevoId,
                    author: {
                        id: user_chat.author.id, 
                        nombre: user_chat.author.nombre, 
                        apellido: user_chat.author.apellido, 
                        edad: user_chat.author.edad, 
                        alias: user_chat.author.alias,
                        avatar: user_chat.author.avatar
                    },
                    text: user_chat.text
                
                }                                
            chats_processed.push(chatObj);
            try{
                await fs.promises.writeFile(this.fileName,JSON.stringify(chats_processed,null,2));                                        
                return {status:"success",message:"chat agregado"}

                }catch(err){
                    return {status:"error",message:"No se pudo agregar el chat"}
                }
                         
        }catch{
            let chatObj = {
                // email:user_chat.email,
                // date:user_chat.date,
                // message:user_chat.message,
                id:1,
                author: {
                    id: user_chat.author.id, 
                    nombre: user_chat.author.nombre, 
                    apellido: user_chat.author.apellido, 
                    edad: user_chat.author.edad, 
                    alias: user_chat.author.alias,
                    avatar: user_chat.author.avatar
                },
                text: user_chat.text
            }    
            try {
                await fs.promises.writeFile(this.fileName,JSON.stringify([chatObj],null,2)) 
                // return {status:"success",message:"Chat agregado",data:id}
                return {status:"success",message:"Chat agregado"}

            }catch(err){
                return {status:"error",message:"No se pudo crear el archivo"}
            }
        }
    }
    //obtiene los chats desde el archivo json
    async getAllChats(){
        try{
            let users_chatsSaved = await fs.promises.readFile(this.fileName,'utf-8');            
            let chats_processed = JSON.parse(users_chatsSaved);                        
            if (chats_processed){
                return {status:"success",data:chats_processed}
            }else{
                return {status:"error",message:"No se encontraron chats"}           
            }            
        }catch(err){
            return {status:"error", message:err}
        }
    }
    // //borra el archivo de chats, lo deja vacío
    // async deleteAllChats(){
    //     try{
    //         await fs.promises.writeFile(this.fileName,JSON.stringify(''),null,2);
    //         return {status:"success",message:"Todos los chats fueron eliminados"}         
    //     }catch(err){
    //         return {status:"error",message:err}
    //     }
    // }
}

export default Chats