const express = require('express');
const router = express.Router();

router.get('/users/signin', (req, res)=>{
    res.render('usuarios/createUser');
})

router.get('/users/signup', (req, res)=>{
    res.render('usuarios/loginUser');
})

module.exports = router;