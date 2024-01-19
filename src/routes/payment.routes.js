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
    readyToGeneratePDF,
    generatedPDF,
    loadTotaldata,
    loadAlumndata,

} = require('../controllers/payment.controllers')

// % ------------------------------------------------------------------------ % //
// % ························· ingresar pagos ······························· % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/selectCourseAddPay', renderSelectCourse)
router.get('/payment/addPayment/:id', addPayment)
router.post('/payment/savePayment/:id', savePayment)

// % ------------------------------------------------------------------------ % //
// % ·············· rutas para retornar informacion de DB ··················· % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/loadPriceMonth/:mes', priceMonthData)
router.get('/payment/loadDataMonth/:mes/:idAlumno', loadDebitMonth)
router.get('/payment/loadMonths/:id', loadMonthData)
router.get('/payment/loadSaldoFavorData/:mes/:nombreMes/:idAlumno', loadTotaldata)
router.get('/payment/loadDataAlumn/:idAlumno', loadAlumndata)

// % ------------------------------------------------------------------------ % //
// % ············ rutas para generar los PDF de las facturas ················ % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/renderDataPDF/:objetosPagos/:objetoDatosHTML/:arraySuccesses/:arrayErrors/:courses', readyToGeneratePDF)
router.post('/payment/generatedPDF', generatedPDF)

// % ------------------------------------------------------------------------ % //
// % ············· rutas para visualizar los datos de los pagos ············· % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/showPay', renderShowPay)






module.exports = router;