const express = require('express');
const router = express.Router();

const {
    renderaddAlumn,
    saveAlumn,
    renderSelectCourse,
    renderShowAlumn,
    renderAllAlumn,
    renderEditAlumn,
    searchAlumn,
    saveEditAlumn,

} = require('../controllers/alumn.controllers')

// % --------------------------------------------------------------- % //
// % ····················· ingresar alumno ························· % //
// % --------------------------------------------------------------- % //
router.get('/alumn/addAlumn/', renderaddAlumn)
router.post('/alumn/saveAlumn', saveAlumn)

// % --------------------------------------------------------------- % //
// % ····················· ver los alumnos ························· % //
// % --------------------------------------------------------------- % //
router.get('/alumn/selectCourseShowAlumn', renderSelectCourse)
router.get('/alumn/showAlumn/:id', renderShowAlumn)

// % --------------------------------------------------------------- % //
// % ·················· ver todos los alumnos ······················ % //
// % --------------------------------------------------------------- % //
router.get('/alumn/showAllAlumn', renderAllAlumn)

// % --------------------------------------------------------------- % //
// % ······················· editar alumno ························· % //
// % --------------------------------------------------------------- % //
router.get('/alumn/editAlumn/:id', renderEditAlumn)
router.post('/alumn/saleEditAlumn/:id', saveEditAlumn)

// # ------------------------------------------------------------------------ //
// # ····················· URLs para mostrar datos ·························· //
// # ------------------------------------------------------------------------ //
router.get('/alumn/searchAlumn/:nombre/:apellido/:DNI', searchAlumn)


module.exports = router;