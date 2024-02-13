const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    //#: validamos si existe el usuario
    const user = await User.findOne({ email })
    if (!user) {
        return done(null, false, { message: 'el email ingresado es invalido' })
    } else {
        //#: validamos la contraseña
        const match = await user.matchPassword(password)
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'la contraseña ingresada es invalida' })
        }
    }
}))

//# passport guarda al usuario para saber que esta logeado
passport.serializeUser((user, done) => {
    done(null, user.id)
})

//#: cada vez que navegamos trata de deserializar al usuario 
//#: (buscar si existe el usuario y si tiene los permisos necesarios para navegar)
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

