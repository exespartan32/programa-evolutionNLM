const express = require('express');
const router = express.Router();
const {
    renderaddCourse,
    saveCourse,
    renderEditCourse,
    saveEdirCourse,
    renderShowCourse
} = require('../controllers/course.controllers')

// % --------------------------------------------------------------- % //
// % ····················· ingresar curso ·························· % //
// % --------------------------------------------------------------- % //
router.get('/course/addCourse', renderaddCourse)
router.post('/course/saveCourse', saveCourse)

// % --------------------------------------------------------------- % //
// % ·················· ver todos los cursos ······················· % // 
// % ······················ editar cursos ·························· % // 
// % --------------------------------------------------------------- % //
router.get('/course/showCourse', renderShowCourse)

// % --------------------------------------------------------------- % //
// % ····················· editar curso ···························· % //
// % --------------------------------------------------------------- % //
router.get('/course/editCourse/:id', renderEditCourse)
router.put('/course/saveEditCourse/:id', saveEdirCourse)



module.exports = router;