// import express from 'express';
// import __dirname from '../utils.js';

// const infoRouter = express.Router();

// infoRouter.get('/',async (req,res)=>{  
//     let argsData  
//     if (process.argv.slice(2).length===0) argsData = 'No hay argumentos'
//     else argsData = process.argv.slice(2)
//     let info ={
//         args: argsData,
//         cwd: process.cwd(),
//         pid: process.pid,
//         version: process.version,
//         title: process.title,
//         platform: process.platform ,
//         memoryUsage: JSON.stringify(process.memoryUsage()),
//         execPath: process.execPath,        
//     }    
//     res.send(info)     
// })

// export default infoRouter