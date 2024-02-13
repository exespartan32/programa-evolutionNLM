const userControllers = {}
const modelUser = require('../models/User')
const passport = require('passport')

// % --------------------------------------------------------------- % //
// % ······················· crear usuario ························· % //
// % --------------------------------------------------------------- % //
userControllers.renderFormCreateUser = async (req, res) => {
    res.render('usuarios/createUser', {})
}

userControllers.saveNewUser = async (req, res) => {
    const email = req.body.emailUser
    const nombreMin = req.body.FirstName.toLowerCase()
    const apellidoMin = req.body.LastName.toLowerCase()
    const nombreUsuario = req.body.UserName
    const contraseñaUsuario = req.body.password

    const newUser = new modelUser({
        email: email,
        nombre: nombreMin,
        apellido: apellidoMin,
        nombreUsuario: nombreUsuario,
        password: contraseñaUsuario,
        fechaCreacion: setDate()
    })
    newUser.password = await newUser.encryptPassword(contraseñaUsuario)

    console.log(newUser)

    const findEmail = await modelUser.findOne({ email: email })
    if (findEmail) {
        req.flash('error_msg', 'el email ya esta en uso')
        res.redirect('/users/signUp')
    } else {
        await newUser.save()
        req.flash('success_msg', 'usuario guardado correctamente');
        res.redirect(`/users/signIn/`)
    }
}

// % --------------------------------------------------------------- % //
// % ······················ iniciar sesion ························· % //
// % --------------------------------------------------------------- % //
userControllers.renderFormLoginUser = async (req, res) => {
/*     const dataParams = req.params
    var data = {}
    //#: cuando rediriguimos luego de crear un usuario
    if (dataParams.email != '-' && dataParams.password != '-') {
        data = dataParams
    }
    res.render('usuarios/login', { data }) */
    res.render('usuarios/loginUser')
}

userControllers.loginUser = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signIn/',
    failureFlash: true
})
/* async (req, res) => {
    res.send("iniciar sesion")
} */


// % --------------------------------------------------------------- % //
// % ······················· cerrar sesion ························· % //
// % --------------------------------------------------------------- % //
userControllers.logout = async (req, res) => {
    req.logout()
    req.flash('success_msg', 'sesion cerrada');
    res.redirect(`/users/signIn/`)
}

// % --------------------------------------------------------------- % //
// % ················· URLs para buscar datos ······················ % //
// % --------------------------------------------------------------- % //
userControllers.searchEmailAdress = async (req, res) => {
    const email = req.params.email
    const searchData = await modelUser.findOne({ email: email })
    var jsonData = {}
    if (searchData) {
        jsonData = searchData
    }
    res.json(jsonData)
}
userControllers.searchFirstAndLastName = async (req, res) => {
    const nombre = req.params.name
    const apellido = req.params.lastName
    const searchData = await modelUser.findOne({ nombre: nombre, apellido: apellido })
    var jsonData = {}
    if (searchData) {
        jsonData = searchData
    }
    res.json(jsonData)
}


// % --------------------------------------------------------------- % //
// % ························ funciones ···························· % //
// % --------------------------------------------------------------- % //
function setDate() {
    //* Seteamos el Date para que se guarde correctamente en DB
    var date = new Date()
    const dateParse = new modelUser({
        fechaCreacion: date,
        offset: date.getTimezoneOffset()
    })
    return new Date(dateParse.fechaCreacion.getTime() - (dateParse.offset * 60000));
}



module.exports = userControllers