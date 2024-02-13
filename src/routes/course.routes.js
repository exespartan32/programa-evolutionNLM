const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth')
const {
    renderaddCourse,
    saveCourse,
    renderEditCourse,
    saveEdirCourse,
    renderShowCourse,
    searchCourse,
    
} = require('../controllers/course.controllers')

// % --------------------------------------------------------------- % //
// % ····················· ingresar curso ·························· % //
// % --------------------------------------------------------------- % //
router.get('/course/addCourse', isAuthenticated, renderaddCourse)
router.post('/course/saveCourse', isAuthenticated, saveCourse)

// % --------------------------------------------------------------- % //
// % ·················· ver todos los cursos ······················· % // 
// % ······················ editar cursos ·························· % // 
// % --------------------------------------------------------------- % //
router.get('/course/showCourse', isAuthenticated, renderShowCourse)

// % --------------------------------------------------------------- % //
// % ····················· editar curso ···························· % //
// % --------------------------------------------------------------- % //
router.get('/course/editCourse/:id', isAuthenticated, renderEditCourse)
router.put('/course/saveEditCourse/:id', isAuthenticated, saveEdirCourse)

// # ------------------------------------------------------------------------ //
// # ······················ URLs para buscar datos ·························· //
// # ------------------------------------------------------------------------ //
router.get('/course/searchCourse/:nombreCurso', isAuthenticated, searchCourse)

module.exports = router;