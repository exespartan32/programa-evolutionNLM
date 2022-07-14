const express = require('express');
const router = express.Router();
const {
    renderaddCourse,
    saveCourse,
    renderEditCourse,
    saveEdirCourse,
    saveDelete,
    renderSelectUp,
    saveUpCourse,
    renderSelectAction,
    renderShowCourse
} = require('../controllers/course.controllers')

// --------------------------------------------------------------- //
// ····················· ingresar curso ·························· //
// --------------------------------------------------------------- //
router.get('/course/addCourse', renderaddCourse)
router.post('/course/saveCourse', saveCourse)

// --------------------------------------------------------------- //
// ················ render editar - eliminar ····················· //
// --------------------------------------------------------------- //
router.get('/course/selectAction', renderSelectAction)

// --------------------------------------------------------------- //
// ····················· editar curso ···························· //
// --------------------------------------------------------------- //
router.get('/course/editCourse/:id', renderEditCourse)
router.put('/course/saveEditCourse/:id', saveEdirCourse)

// --------------------------------------------------------------- //
// ···················· eliminar curso ··························· //
// --------------------------------------------------------------- //
router.put('/course/saveDeleteCourse/:id', saveDelete)

// --------------------------------------------------------------- //
// ·················· dar de alta a curso ························ //
// --------------------------------------------------------------- //
router.get('/course/selectUp', renderSelectUp)
router.put('/course/saveUpCourse/:id', saveUpCourse)

// --------------------------------------------------------------- //
// ·················· ver todos los cursos ······················· //
// --------------------------------------------------------------- //
router.get('/course/showCourse', renderShowCourse)

module.exports = router;