// import {db} from "../config.js";

// export default class chatConteiner{
//     constructor(){
//         db.schema.hasTable('chats').then(result=>{
//             if(!result){
//                 db.schema.createTable('chats',table=>{
//                     table.increments();
//                     table.string('email');
//                     table.string('date');
//                     table.string('message');                    
//                 }).then(result=>{
//                     console.log('Tabla de chats creada')
//                 })
//             }
//         })
//     }

//     saveChats = async (chat) => {             
//         try {            
//             let exist = await db.table('chats').select();                  
//             if (!exist) return {status:"error",message:"No existe la tabla de chats"};
//             let result = await db.table('chats').insert(chat);            
//             return {status:"success",message:"chat agregado",data:result}
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }

//     getAllChats = async () =>{        
//         try {
//             let chat = await db.select().table('chats');                            
//             return {status:'success',data:chat}
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }  
// }