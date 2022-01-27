import passport from "passport";
import fbStrategy from 'passport-facebook';
import {users} from './daos/index.js'
import local from 'passport-local'
import { createHash, isValidPassword } from "./utils.js";

const FacebookStrategy = fbStrategy.Strategy;
const LocalStrategy = local.Strategy;

export const initializePassportConfig = ()=>{
    passport.use('facebook',new FacebookStrategy({
        clientID:'898273697516167',
        callbackURL:'https://9353-2800-810-598-8c39-d0c4-7f9-1b4-e97e.ngrok.io/auth/facebook/callback',
        clientSecret:'a5c5485f55a5853f146e6ec272291676',
        profileFields:['emails','picture','displayName']
    },async(accessToken,refreshToken,profile,done)=>{
        try{                  
            let user = await users.getByEmail(profile.emails[0].value)//email     
            if (user.status=="success"){await users.updateAvatar(profile.emails[0].value,profile.photos[0].value)}
            let userProcessed = JSON.parse(JSON.stringify(user)) 
            done(null,userProcessed)
        }catch(error){
            done(error)
        }
    }))   
}


export const initializePassportLocal = ()=>{
    passport.use('register',new LocalStrategy({passReqToCallback:true},async(req,username,password,done)=>{
        try{
            let user= await users.getByUserName(username);
            let userProcessed = JSON.parse(JSON.stringify(user))    
            console.log('esta aca dentro de passport');        

            if (userProcessed.data) return done(null,false)            
            const newUser ={
                username:username,
                password:createHash(password),
                email:req.body.email,
                name:req.body.name,
                lastName:req.body.lastName,
                age:req.body.age,
                avatar:req.body.avatar
            }            
            try{                
                let result = await users.save(newUser);               
                return done(null,result)
            }catch(err){
                return done(err)
            }
        }catch(err){
            return done(err)
        }
    }))
    passport.use('login',new LocalStrategy(async(username,password,done)=>{
        try{
            let user = await users.getByUserName(username)
            let userProcessed = JSON.parse(JSON.stringify(user))//parseo mi resultado para quitar el object id            
            if(!userProcessed.data) return done(null,false,{message:'no se encontro usuario'})
            if(!isValidPassword(userProcessed,password)) return done(null,false,{message:'invalid password'});            
            return done(null,userProcessed);
        }catch(err){
            done(err)
        }
    }))
    passport.serializeUser((user,done)=>{   
        console.log('en serialize');     
        let userProcessed = JSON.parse(JSON.stringify(user)) //parseo mi resultado para quitar el object id        
        done(null,userProcessed.data._id)
    })
    passport.deserializeUser(async (id,done)=>{            
        console.log('en deserialize');
        let {data} = await users.getById(id)
        let userProcessed = JSON.parse(JSON.stringify(data))   
        console.log(userProcessed);
        if (userProcessed) {done(null,userProcessed)}

    })
}