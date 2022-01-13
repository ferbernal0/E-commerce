import config from '../config.js';
import admin from 'firebase-admin'
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const serviceAccount = require("../db/ecommerce-c2038-firebase-adminsdk-gqp0m-5b1d17cf80.json")

//inicializo firestore
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.fb.baseUrl
});

//creo la clase de firestore donde recibira de sus hijos, las colecciones 
export default class FbConteiner{
    constructor(collection){
        this.db = admin.firestore();   
        this.currentCollection = this.db.collection(collection)
    }
}
