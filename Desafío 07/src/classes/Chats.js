import fs from 'fs'

class Chats{    
    constructor(fileName){
        this.fileName=fileName
    }
    
    async saveChats(chat){       
        try{
            let data =await fs.promises.readFile(this.fileName,'utf-8');            
            let chats =JSON.parse(data);          
            let nuevoId = chats[chats.length-1].id+1;  

            let chatObj = {
                    email:chat.email,
                    date:chat.date,
                    message:chat.message,
                    id:nuevoId,
                }                                
            chats.push(chatObj);
            try{
                await fs.promises.writeFile(this.fileName,JSON.stringify(chats,null,2));                                        
                return {status:"success",message:"chat agregado"}

                }catch(err){
                    return {status:"error",message:"No se pudo agregar el chat"}
                }
                         
        }catch{
            let chatObj = {
                email:chat.email,
                date:chat.date,
                message:chat.message,
                id:1,
            }    
            try {
                await fs.promises.writeFile(this.fileName,JSON.stringify([chatObj],null,2)) 
                return {status:"success",message:"Chat agregado"}

            }catch(err){
                return {status:"error",message:"No se pudo crear el archivo"}
            }
        }
    }
  
    async getAllChats(){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');            
            let chats = JSON.parse(data);                        
            if (chats){
                return {status:"success",chatsData:chats}
            }else{
                return {status:"error",message:"No se encontraron chats"}           
            }            
        }catch(err){
            return {status:"error", message:err}
        }
    }

    async deleteAllChats(){
        try{
            await fs.promises.writeFile(this.fileName,JSON.stringify(''),null,2);
            return {status:"success",message:"Todos los chats fueron eliminados"}         
        }catch(err){
            return {status:"error",message:err}
        }
    }
}

export default Chats