const express = require('express');
const router = express.Router();

const {
    renderShowCourse,
    renderPriceMonth,
    savePriceMonth,
    renderSelectCourseAction,
    renderSelectAction,
    renderEditPrice,
    saveEditCourse,
    deleteCourse,
    renderAltCourse,
    saveUpPriceMonth,
    selectPriceCourseUp
} = require('../controllers/price.course.controllers');

router.get('/course/selectCourse', renderShowCourse);
router.get('/course/addPriceMonth/:id', renderPriceMonth);
router.post('/course/savePriceMonth/:id', savePriceMonth);

router.get('/course/selectCoursePriceAction', renderSelectCourseAction);
router.get('/course/selectAction/:id', renderSelectAction)

router.get('/course/editPriceCourse/:id', renderEditPrice)
router.put('/course/saveEditPriceCourse/:id', saveEditCourse)

router.get('/course/deletePriceCourse/:id', deleteCourse)

router.get('/course/selectPriceCourseUp', selectPriceCourseUp)
router.get('/course/altPriceCourse/:id', renderAltCourse)
router.put('/course/saveUpPriceCourse/:id', saveUpPriceMonth)


module.exports = router;