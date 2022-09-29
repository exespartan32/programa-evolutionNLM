const express = require('express');
const router = express.Router();

const {
    renderSelectCourse,
    renderaddAlumn,
    saveAlumn
} = require('../controllers/alumn.controllers')

// --------------------------------------------------------------- //
// ····················· ingresar alumno ························· //
// --------------------------------------------------------------- //
router.get('/alumn/addAlumn/', renderaddAlumn)
router.post('/alumn/saveAlumn', saveAlumn) 

/* 
router.get('/alumn/selectCourse', renderSelectCourse)
*/
router.get('alumn/')

module.exports = router;