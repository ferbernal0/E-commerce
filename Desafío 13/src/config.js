import knex from 'knex';
import __dirname from './utils.js';

// export const db = knex({
//     client:'sqlite3',
//     connection:{filename:__dirname+'/db/ecommerce.sqlite' }
// })

// export const database = knex ({
//     client:'mysql',
//     version:'10.4.22',
//     connection:{
//         host:'127.0.0.1',
//         port:3306,
//         user:'root',
//         password:'',
//         database:'ecommerce'
//     },
//     pool:{min:0,max:10}
// })

export default{
    fileSystem:{
        baseUrl:__dirname+'/files/'
    },
    mongo:{        
        baseUrl:'mongodb+srv://fbernal:1234@ecommerce.rpxxc.mongodb.net/ecommerce?retryWrites=true&w=majority'
    },
    fb:{
        baseUrl:'https://ecommerce-c2038.firebaseio.com'
    },
    mongoSessions:{
        baseUrl:'mongodb+srv://fbernal:1234@ecommerce.rpxxc.mongodb.net/ecommerce?retryWrites=true&w=majority'
    },
    mongoPassBase:{
        baseUrl:'mongodb+srv://fbernal:1234@ecommerce.rpxxc.mongodb.net/PassBase?retryWrites=true&w=majority'
    }
}

