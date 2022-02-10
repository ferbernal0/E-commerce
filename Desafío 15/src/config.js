import __dirname from './utils.js';
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path:path.resolve(__dirname,'../ecommerce.env')
});

export default{
    fileSystem:{
        baseUrl:process.env.FILE_SYSTEM
    },
    mongo:{        
        baseUrl: process.env.MONGO_URL
    },
    fb:{
        baseUrl: process.env.FIREBASE_URL,
        typeAccount:process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId:process.env.FIREBASE_PRIVATE_CLIENT_KEY,
        privateKey:process.env.FIREBASE_PRIVATE_KEY,
        clientEmail:process.env.FIREBASE_CLIENT_MAIL,
        clientId:process.env.FIREBASE_CLIENT_ID,
        authUri:process.env.FIREBASE_AUTH_URI,
        tokenUri:process.env.FIREBASE_TOKEN_URI,
        authProviderCertUri:process.env.FIREBASE_AUTH_PROVIDER_URI,
        clientCertUri:process.env.FIREBASE_CLIENT_CERT_URL,
    },
    mongoSessions:{
        baseUrl: process.env.MONGO_SESSIONS
    },
    secretCode:{
        key: process.env.PROJECT_SECRET_CODE
    },
    facebook:{
        keyID: process.env.FACEBOOK_CLIENT_ID,
        keySecret: process.env.FACEBOOK_CLIENT_SECRET,
        callback: process.env.FACEBOOK_CALLBACK
    }
}

