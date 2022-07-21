const express = require('express');
const router = express.Router();

const {
    renderShowCourse,
    renderPriceMonth,
    savePriceMonth,
    renderSelectCourseAction,
    renderSelectAction,
    renderEditPrice,
    saveEditCourse
} = require('../controllers/price.course.controllers');

router.get('/course/selectCourse', renderShowCourse);
router.get('/course/addPriceMonth/:id', renderPriceMonth);
router.post('/course/savePriceMonth', savePriceMonth);

router.get('/course/selectCoursePriceAction', renderSelectCourseAction);
router.get('/course/selectAction/:id', renderSelectAction)

router.get('/course/editPriceCourse/:id', renderEditPrice)
router.put('/course/saveEditPriceCourse/:id', saveEditCourse)


module.exports = router;