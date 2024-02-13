const express = require('express');
const router = express.Router();
const passport = require('passport')

const {
    renderFormCreateUser,
    renderFormLoginUser,
    saveNewUser,
    searchEmailAdress,
    searchFirstAndLastName,
    loginUser,
    logout,
    
} = require('../controllers/user.controllers')


// % --------------------------------------------------------------- % //
// % ······················· crear usuario ························· % //
// % --------------------------------------------------------------- % //
router.get('/users/signUp', renderFormCreateUser)
router.post('/users/saveNewUser', saveNewUser)

// % --------------------------------------------------------------- % //
// % ······················ iniciar sesion ························· % //
// % --------------------------------------------------------------- % //
router.get('/users/signIn/', renderFormLoginUser)
router.post('/users/loginUser', loginUser)

// % --------------------------------------------------------------- % //
// % ······················· cerrar sesion ························· % //
// % --------------------------------------------------------------- % //
router.get('/users/logout/', logout)

// % --------------------------------------------------------------- % //
// % ················· rutas para buscar los datos ················· % //
// % --------------------------------------------------------------- % //
router.get('/users/findEmailAdress/:email/', searchEmailAdress)
router.get('/users/findFirstAndLastName/:name/:lastName', searchFirstAndLastName)


module.exports = router;