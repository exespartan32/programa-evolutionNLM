const express = require('express');
const router = express.Router();

const {
    renderShowCourse,
    renderPriceMonth,
    savePriceMonth,
    renderSelectCourseViewPrice,
    ViewPriceCourse,
    renderEditPrice,
    saveEditCourse,
} = require('../controllers/price.course.controllers');

// --------------------------------------------------------------- //
// ···················· ingresar precio ·························· //
// --------------------------------------------------------------- //
router.get('/course/selectCourse', renderShowCourse);
router.get('/course/addPriceMonth/:id', renderPriceMonth);
router.post('/course/savePriceMonth/:id', savePriceMonth);

// --------------------------------------------------------------- //
// ·················· ver todos los precios ······················ // 
// ······················ editar precios ························· // 
// --------------------------------------------------------------- //
router.get('/course/selectViewPC/', renderSelectCourseViewPrice)
router.get('/course/showPriceCourse/:id', ViewPriceCourse)

// --------------------------------------------------------------- //
// ····················· editar precio ··························· //
// --------------------------------------------------------------- //
router.get('/course/editPriceCourse/:id', renderEditPrice)
router.put('/course/saveEditPriceCourse/:id', saveEditCourse)

/* router.get('/course/selectCoursePriceAction', renderSelectCourseAction);
router.get('/course/selectAction/:id', renderSelectAction)

router.get('/course/editPriceCourse/:id', renderEditPrice)
router.put('/course/saveEditPriceCourse/:id', saveEditCourse)

router.get('/course/deletePriceCourse/:id', deleteCourse)

router.get('/course/selectPriceCourseUp', selectPriceCourseUp)
router.get('/course/altPriceCourse/:id', renderAltCourse)
router.put('/course/selectViewPC/:id', saveUpPriceMonth)


router.get('/course/selectViewPC/', renderSelectCourseViewPrice)
router.get('/course/showPriceCourse/:id', ViewPriceCourse) */



module.exports = router;