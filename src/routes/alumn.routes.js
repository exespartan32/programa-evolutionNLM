const express = require('express');
const router = express.Router();

const {
    renderaddAlumn,
    saveAlumn,
    renderSelectCourse,
    renderShowAlumn,
    renderAlumn,
    renderEditAlumn,
} = require('../controllers/alumn.controllers')

// --------------------------------------------------------------- //
// ····················· ingresar alumno ························· //
// --------------------------------------------------------------- //
router.get('/alumn/addAlumn/', renderaddAlumn)
router.post('/alumn/saveAlumn', saveAlumn)

// --------------------------------------------------------------- //
// ····················· ver los alumnos ························· //
// --------------------------------------------------------------- //
router.get('/alumn/selectCourseShowAlumn', renderSelectCourse)
router.get('/alumn/showAlumn/:id', renderShowAlumn)

// --------------------------------------------------------------- //
// ·················· ver todos los alumnos ······················ //
// --------------------------------------------------------------- //
router.get('/alumn/showAllAlumn', renderAlumn)

// --------------------------------------------------------------- //
// ······················· editar alumno ························· //
// --------------------------------------------------------------- //
router.get('/alumn/editAlumn/:id', renderEditAlumn)

module.exports = router;