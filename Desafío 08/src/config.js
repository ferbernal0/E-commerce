import knex from 'knex';
import __dirname from './utils.js'

export const db = knex({
    client:'sqlite3',
    connection:{filename:__dirname+'/db/ecommerce.sqlite' }
})


export const database = knex ({
    client:'mysql',
    version:'10.4.22',
    connection:{
        host:'127.0.0.1',
        port:3306,
        user:'root',
        password:'',
        database:'ecommerce'
    },
    pool:{min:0,max:10}
})
