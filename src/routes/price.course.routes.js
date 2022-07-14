const express = require('express');
const router = express.Router();

const {
    renderShowCourse,
} = require('../controllers/price.course.controllers');

router.get('/course/selectCourse', renderShowCourse)

module.exports = router;