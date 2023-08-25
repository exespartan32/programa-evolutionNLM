const express = require('express');
const router = express.Router();
const {
    renderSelectCourse,
    addPayment,
    renderShowPay,
    savePayment,
    renderPreviusMonth,
    priceMonthData,
    loadDebitMonth,
    loadMonthData,

} = require('../controllers/payment.controllers')

// --------------------------------------------------------------- //
// ····················· ingresar pagos ·························· //
// --------------------------------------------------------------- //
router.get('/payment/selectCourseAddPay', renderSelectCourse)
router.get('/payment/addPayment/:id', addPayment)

// ------------------------------------------------------------------------ //
// ·············· rutas para retornar informacion de DB ··················· //
// ------------------------------------------------------------------------ //
router.get('/payment/loadPriceMonth/:mes', priceMonthData)
router.get('/payment/loadDebitMonth/:mes', loadDebitMonth)
router.get('/payment/loadMonths/:id', loadMonthData)


// --------------------------------------------------------------- //
// ····················· pagar mes deudor ························ //
// --------------------------------------------------------------- //
router.get('/payment/paymentPreviusMonth', renderPreviusMonth)

// --------------------------------------------------------------- //
// ························ ver pagos ···························· //
// --------------------------------------------------------------- //
router.get('/payment/showPay', renderShowPay)
router.post('/payment/savePayment/:id', savePayment)






module.exports = router;