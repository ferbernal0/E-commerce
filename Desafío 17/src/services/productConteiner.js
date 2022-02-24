// import {database} from "../config.js";

// export default class productConteiner {
//     constructor(){
//         database.schema.hasTable('products').then(result=>{
//             if(!result){
//                 database.schema.createTable('products',table=>{
//                     table.increments();
//                     table.string('title').notNullable().defaultTo('Product title');
//                     table.string('description').notNullable().defaultTo('Product description');
//                     table.string('code').notNullable().defaultTo('Product code');
//                     table.string('thumbnail');
//                     table.integer('price').notNullable().defaultTo(0);
//                     table.integer('stock').notNullable().defaultTo(0);
//                     table.timestamps(true,true);
//                 }).then(result=>{
//                     console.log('Tabla de productos creada')
//                 })
//             }
//         })
//     }

//     save = async (product) => {
//         try {
//             let exist = await database.table('products').select().where('title',product.title).first()            
//             if (exist) return {status:"error",message:"Producto existente, no es posible agregar otro producto igual"}
//             let result = await database.table('products').insert(product) 
//             return {status:'success',data:`Producto creado con id: ${result[0]}`}
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }

//     getById = async (id) =>{
//         try {
//             let product = await database.select().table('products').where('id',id).first()
//             if (product){
//                 return {status:'success',data:product}
//             }else{
//                 return {status:"error",message:`Producto id: ${id} no encontrado`}
//             }
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }

//     getAll = async () =>{
//         try {
//             let products = await database.select().table('products');
//             return {status:'success',data:products}
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }

//     updateProduct = async (id,productSelect) =>{        
//         try {
//             let product = await database.select().table('products').where('id',id).first()            
//             if (product){
//                 await database('products').where('id',id).update(productSelect);
//                 return {status:'success',message:`El producto con id: ${id} ha sido actualizado`}
//             }else{
//                 return {status:"error",message:`Producto con id: ${id} no encontrado`}
//             }
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }

//     deleteById = async (id) =>{               
//         try {
//             let product = await database.select().table('products').where('id',id).first()
//             if (product){
//                 await database('products').del().where('id',id);
//                 return {status:'success',message:`El producto con id: ${id} ha sido eliminado`}
//             }else{
//                 return {status:"error",message:`Producto con id: ${id} no encontrado`}
//             }
//         }catch(error){
//             return {status:'error', message:error}
//         }
//     }
// }