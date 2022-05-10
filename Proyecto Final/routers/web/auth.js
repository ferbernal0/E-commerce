const Router = require('express')
const path = require('path')

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require ('passport-local').Strategy

const User = require('../../models/User')
const createHash = require('../../utils/createHash')
const isValidPassword = require('../../utils/isValidPassword.js')

const authWebRouter = new Router();

authWebRouter.get('/', (req, res) =>{
    res.redirect('/home')
})

authWebRouter.get('/login', (req, res) =>{
    const nombre = req.session?.nombre
    if (nombre){
        res.redirect('/')
    } else{
        res.sendFile(path.join(process.cwd(), 'views/login.html'))
    }
})

authWebRouter.get('/singup', (req, res) =>{
    const nombre = req.session?.nombre
    if (nombre){
        res.redirect('/')
    } else{
        res.sendFile(path.join(process.cwd(), 'views/singup.html'))
    }
})

authWebRouter.get('/logout', (req, res) =>{
    const nombre = req.session?.nombre
    if (nombre){
        req.session.destroy(err => {
            if (!err){
                res.render(path.join(process.cwd(), 'views/pages/logout.ejs'), {nombre})
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
})

authWebRouter.get('/faillogin', (req, res) => {
    res.render(path.join(process.cwd(), 'views/pages/faillogin.ejs'));
})

authWebRouter.get('/failsignup', (req, res) => {
    res.render(path.join(process.cwd(), 'views/pages/failsingup.ejs'));
})

authWebRouter.post('/login', (req, res) =>{
    req.session.nombre = req.body.nombre
    res.redirect('/home')
})

passport.use('login', new LocalStrategy((userName, password, done) => {
    console.log(userName)
    User.findOne({ email: userName }, (error, user) => {
        if (error)
            return done(error);
    
        if (!user) {
            console.log('User Not Found with username ' + userName);
            return done(null, false);
        }
    
        if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            return done(null, false);
        }

        console.log({error, user});
        return done(null, {});
    })
}))

passport.use('singup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
        if (err) {
            console.log('Error in SignUp: ' + err);
            return done(err);
        }
        
        if (user) {
            console.log('User already exists');
            return done(null, false)
        }
        
        const newUser = {
            username: username,
            password: createHash(password),
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        User.create(newUser, (error, userCreated) => {
            if (error) {
                console.log('Error in Saving user: ' + err);
                return done(err);
            }
            console.log('User Registration succesful');
            return done(null, userCreated);
        });
    })
}))

authWebRouter.post(
    '/auth/local',
    passport.authenticate('login', { failureRedirect: '/faillogin', session: false}),
    (req, res) => {
        res.redirect('/')
    }
);

authWebRouter.post(
    '/signup/local',
    passport.authenticate('singup', { failureRedirect: '/failsignup', session: false }),
    (req, res) => {
        res.redirect('/')
    }
);

module.exports = authWebRouter