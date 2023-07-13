const express = require('express');
const router = express.Router();
const {
    renderSelectCourse,
    addPayment,
    renderShowPay,
    savePayment,
} = require('../controllers/payment.controllers')

// --------------------------------------------------------------- //
// ····················· ingresar pagos ·························· //
// --------------------------------------------------------------- //
router.get('/payment/selectCourseAddPay', renderSelectCourse)
router.get('/payment/addPayment/:id', addPayment)

// --------------------------------------------------------------- //
// ························ ver pagos ···························· //
// --------------------------------------------------------------- //
router.get('/payment/showPay', renderShowPay)
router.post('/payment/savePayment/:id', savePayment)

module.exports = router;