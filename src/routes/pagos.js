const express = require('express');
const router = express.Router();
// --------------------------------------------------------------- //
// ····················· modelos ··························· //
// --------------------------------------------------------------- //
const Pagos = require('../models/Pagos')

// --------------------------------------------------------------- //
// ····················· ingresar pago ··························· //
// --------------------------------------------------------------- //
router.get('/pagos/ingresarPago', (req, res) => {
    res.render('pagos/addPay')
})

router.post('/pagos/addPay', async (req, res) => {
    var data = (req.body)
    //console.log(data)
    const { nombreAlumno, apellidoAlumno, pagoAlumno, pagoMes } = data

    const errors = [];
    if (!nombreAlumno) {
        errors.push({ text: 'Por Favor escriba un Nombre' })
    }
    if (!apellidoAlumno) {
        errors.push({ text: 'Por Favor escriba un Apellido' })
    }
    if (!pagoAlumno) {
        errors.push({ text: 'Por Favor escriba un Pago' })
    }
    if (!pagoMes) {
        errors.push({ text: 'Por Favor escriba un Mes de Pago' })
    }

    if (errors.length > 0) {
        res.render('pagos/addPay', {
            errors,
            nombreAlumno,
            apellidoAlumno,
            pagoAlumno,
            pagoMes
        })
    } else {
        const newPay = new Pagos({ nombreAlumno, apellidoAlumno, pagoAlumno, pagoMes })
        await newPay.save()
        console.log(newPay)
        //res.send('datos guardados en DB')
        //res.redirect('/savePay')
    }
})

router.get('/mesageAdd', async (req, res) => {
    res.render('pagos/')
})
// --------------------------------------------------------------- //
// ····················· editar pago ····························· //
// --------------------------------------------------------------- //
router.get('/pagos/editarPago', (req, res) => {
    res.render('pagos/editPay')
})

router.post('/pagos/editPay', (req, res) => {
    console.log(req.body)
    res.send('datos recibidos')
})
// --------------------------------------------------------------- //
// ····················· eliminar pago ··························· //
// --------------------------------------------------------------- //
router.get('/pagos/borrarPago', async(req, res) => {
    const pays = await Pagos.find().sort({ date: 'desc' });
    res.render('pagos/remuvePay', { pays })
})

router.post('/pagos/deletePay', (req, res) => {
    console.log(req.body)
    res.send('datos recibidos')
})
// --------------------------------------------------------------- //
// ····················· ver todos los pagos ····················· //
// --------------------------------------------------------------- //
router.get('/pagos/verPago', async (req, res) => {
    const pays = await Pagos.find().sort({ date: 'desc' });
    res.render('pagos/showPay', { pays })
})
// --------------------------------------------------------------- //
// ····················· ver pago de alumno x ···················· //
// --------------------------------------------------------------- //
router.get('/pagos/verPagoAlumno', async(req, res) => {
    const pays = await Pagos.find().sort({ date: 'desc' });
    res.render('pagos/showPayAlumn', { pays })
})
// --------------------------------------------------------------- //
// ····················· buscar tiket de pago ···················· //
// --------------------------------------------------------------- //
router.get('/pagos/buscarTiket', (req, res) => {
    res.render('pagos/showTiket')
})

router.post('/pagos/search', (req, res) => {
    console.log(req.body)
    res.send('datos recibidos')
})

module.exports = router;