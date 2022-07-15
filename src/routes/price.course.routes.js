const express = require('express');
const router = express.Router();

const {
    renderShowCourse,
    renderPriceMonth,
    savePriceMonth,
} = require('../controllers/price.course.controllers');

router.get('/course/selectCourse', renderShowCourse);
router.get('/course/addPriceMonth/:id', renderPriceMonth);
router.post('/course/savePriceMonth', savePriceMonth);

module.exports = router;