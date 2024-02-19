const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth')
const {
    renderaddAlumn,
    saveAlumn,
    renderSelectCourse,
    renderShowAlumn,
    renderAllAlumn,
    renderEditAlumn,
    searchAlumn,
    saveEditAlumn,
    searchDNI,
    

} = require('../controllers/alumn.controllers')

// % --------------------------------------------------------------- % //
// % ····················· ingresar alumno ························· % //
// % --------------------------------------------------------------- % //
router.get('/alumn/addAlumn/', isAuthenticated, renderaddAlumn)
router.post('/alumn/saveAlumn', isAuthenticated, saveAlumn)

// % --------------------------------------------------------------- % //
// % ····················· ver los alumnos ························· % //
// % --------------------------------------------------------------- % //
router.get('/alumn/selectCourseShowAlumn', isAuthenticated, renderSelectCourse)
router.get('/alumn/showAlumn/:id', isAuthenticated, renderShowAlumn)

// % --------------------------------------------------------------- % //
// % ·················· ver todos los alumnos ······················ % //
// % --------------------------------------------------------------- % //
router.get('/alumn/showAllAlumn', isAuthenticated, renderAllAlumn)

// % --------------------------------------------------------------- % //
// % ······················· editar alumno ························· % //
// % --------------------------------------------------------------- % //
router.get('/alumn/editAlumn/:id', isAuthenticated, renderEditAlumn)
router.post('/alumn/saleEditAlumn/:id', isAuthenticated, saveEditAlumn)

// # ------------------------------------------------------------------------ //
// # ····················· URLs para mostrar datos ·························· //
// # ------------------------------------------------------------------------ //
router.get('/alumn/searchAlumn/:nombre/:apellido/:DNI', isAuthenticated, searchAlumn)
router.get('/alumn/searchDNI/:DNI', isAuthenticated, searchDNI)



module.exports = router;