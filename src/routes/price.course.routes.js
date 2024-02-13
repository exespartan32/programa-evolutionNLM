const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth')
const {
    renderShowCourse,
    renderPriceMonth,
    savePriceMonth,
    renderSelectCourseViewPrice,
    ViewPriceCourse,
    renderEditPrice,
    saveEditCourse,
} = require('../controllers/price.course.controllers');

// % --------------------------------------------------------------- % //
// % ···················· ingresar precio ·························· % //
// % --------------------------------------------------------------- % //
router.get('/course/selectCourse', isAuthenticated, renderShowCourse);
router.get('/course/addPriceMonth/:id', isAuthenticated, renderPriceMonth);
router.post('/course/savePriceMonth/:id', isAuthenticated, savePriceMonth);

// % --------------------------------------------------------------- % //
// % ·················· ver todos los precios ······················ % // 
// % ······················ editar precios ························· % // 
// % --------------------------------------------------------------- % //
router.get('/course/selectViewPC/', isAuthenticated, renderSelectCourseViewPrice)
router.get('/course/showPriceCourse/:id', isAuthenticated, ViewPriceCourse)

// % --------------------------------------------------------------- % //
// % ····················· editar precio ··························· % //
// % --------------------------------------------------------------- % //
router.get('/course/editPriceCourse/:id', isAuthenticated, renderEditPrice)
router.put('/course/saveEditPriceCourse/:id', isAuthenticated, saveEditCourse)

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