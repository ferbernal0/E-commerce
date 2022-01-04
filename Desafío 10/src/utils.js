import { fileURLToPath } from "url";
import {dirname} from 'path';

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

//middleware utilizado para validar si se esta en modo administrador o no
export const authMiddleware = (req,res,next)=>{
    if(!req.auth) {        
        res.status(403).send({error:-2,message:"NO AUTORIZADO"})
        console.log(`Status ${res.statusMessage} en metodo ${req.method}, status code: ${res.statusCode} `)        
    } else next();
}

export default __dirname;