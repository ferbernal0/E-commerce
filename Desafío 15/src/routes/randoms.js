import express from 'express';
import __dirname from '../utils.js';
import { fork } from 'child_process';


const randomsRouter = express.Router();

randomsRouter.get('/',async (req,res)=>{  
    let data = req.query.cant
    if (data===''||data===undefined) data= 100000000
    else {
        parseInt(data)        
    }
    console.log(data);
    let result = fork('calc')
    res.send({message:'randomsRouter',numbers:data})      
})

export default randomsRouter