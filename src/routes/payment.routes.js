const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth')
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
router.get('/payment/selectCourseAddPay', isAuthenticated, renderSelectCourse)
router.get('/payment/addPayment/:id', isAuthenticated, addPayment)
router.post('/payment/savePayment/:id', isAuthenticated, savePayment)

// % ------------------------------------------------------------------------ % //
// % ·············· rutas para retornar informacion de DB ··················· % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/loadPriceMonth/:mes', isAuthenticated, priceMonthData)
router.get('/payment/loadDataMonth/:mes/:idAlumno', isAuthenticated, loadDebitMonth)
router.get('/payment/loadMonths/:id', isAuthenticated, loadMonthData)
router.get('/payment/loadSaldoFavorData/:mes/:nombreMes/:idAlumno', isAuthenticated, loadTotaldata)
router.get('/payment/loadDataAlumn/:idAlumno', isAuthenticated, loadAlumndata)

// % ------------------------------------------------------------------------ % //
// % ············ rutas para generar los PDF de las facturas ················ % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/renderDataPDF/:objetosPagos/:objetoDatosHTML/:arraySuccesses/:arrayErrors/:courses', isAuthenticated, readyToGeneratePDF)
router.post('/payment/generatedPDF', isAuthenticated, generatedPDF)

// % ------------------------------------------------------------------------ % //
// % ············· rutas para visualizar los datos de los pagos ············· % //
// % ------------------------------------------------------------------------ % //
router.get('/payment/showPay', isAuthenticated, renderShowPay)






module.exports = router;