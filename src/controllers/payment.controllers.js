const paymentControllers = {};
const mongoose = require('mongoose');
const course = require('../models/curso')
const alumn = require('../models/alumno')
const priceCourse = require('../models/valorCurso');
const movAlumn = require('../models/movimientoDeAlumno')
const movAcc = require('../models/movimientoDeCuenta')
const functionspayment = require('./functionsPaymentControllers');
const valorCurso = require('../models/valorCurso');
const PDF = require('pdfkit-construct')
const fs = require('fs');
const { bufferedPageRange } = require('pdfkit');
const { Stream } = require('stream');
const { join } = require('path');
// --------------------------------------------------------------- //
// ····················· ingresar pagos ·························· //
// --------------------------------------------------------------- //
// -------------------- 1) eleguir curso ------------------------- //
paymentControllers.renderSelectCourse = async (req, res) => {
    const courses = await course.find().sort({ fechaInicioCurso: 'asc' });
    const errors = []
    if (courses.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('pagos/selectCourseAddPayment', { errors })
    }
    res.render('pagos/selectCourseAddPayment', { courses })
}

// ------------------------- 2) agregar pago --------------------- //
paymentControllers.addPayment = async (req, res) => {
    //* recibimos el id del curso y buscamos en la lista de MovAlumn
    const idCourse = req.params.id
    const dataCourse = await course.findById(idCourse)
    const listMovAlumn = await movAlumn.find({ idCurso: { $eq: idCourse } })
    const valCourse = await priceCourse.find({ idCurso: idCourse }).sort({ mes: 1 })

    var listMonth = functionspayment.listMonth(valCourse)
    var numerMonth = listMonth.numerMonth

    //* recorremos la lista de MovAlumn
    //* buscamos los alumnos que tiene el curso
    //* agregamos los alumnos del curso a la lista alumnList
    const alumnList = []
    for (let i = 0; i < listMovAlumn.length; i++) {
        const idAlumn = listMovAlumn[i].idAlumno
        const alumnData = await alumn.findById(idAlumn)
        alumnList.push(alumnData)
    }
    res.render('pagos/agregarPago', { dataCourse, alumnList, numerMonth })
}

// ------------------------- 2) guardamos el pago --------------------- //
paymentControllers.savePayment = async (req, res) => {
    //TODO:  datos recibidos desde el formulario
    const idCurso = req.params.id
    const { idAlumno, dataTotal } = req.body

    const transformData = dataTotal.replace(/['"]+/g, '"');
    const jsonData = JSON.parse(transformData)

    //res.send(jsonData)

    //TODO: variables
    const ArrayNumeroMeses = jsonData.numeroMes
    const ArrayNombreMeses = jsonData.nombreMes
    const ArrayPrecioMes = jsonData.precioMes
    const ArraySaldoMes = jsonData.saldoMes
    const ArrayDeudaMes = jsonData.deuda
    const ArrayPagoAlumno = jsonData.pagoAlumno
    const ArrayUsoSaldoFavor = jsonData.usoSaldoFavor
    const ArrayComentario = jsonData.comentario
    const arraySuccesses = []
    const arrayErrors = []
    var IdPagoConjunto = new mongoose.Types.ObjectId();

    //console.log("IdPagoConjunto: " + IdPagoConjunto)
    //console.log("ArrayNumeroMeses")
    //console.log(ArrayNumeroMeses)
    //console.log(ArrayNumeroMeses.length)

    for (let i = 0; i < ArrayNumeroMeses.length; i++) {
        //#: datos de cada item
        var NombreMesI = ArrayNombreMeses[i]
        var NumeroMesI = ArrayNumeroMeses[i]
        var precioMesI = ArrayPrecioMes[i]
        var saldoMesI = ArraySaldoMes[i]
        var deudaMesI = ArrayDeudaMes[i]
        var pagoAlumnoI = ArrayPagoAlumno[i]
        var usaSaldoFavorI = ArrayUsoSaldoFavor[i]
        var comentario = ArrayComentario[i]

        //#: variables de busquedas
        const valCourse = await valorCurso.find({ mes: NumeroMesI, idCurso: idCurso })
        var idValorCurso = valCourse[0].id
        var datosDB = await movAcc.find({})

        //#: variables globales para guardar en DB
        var deudor = 0
        var acreedor = 0
        var estado = null
        var debe = 0
        var haber = pagoAlumnoI
        var numeroBoleta = 0
        var saldoFavorUsado = 0
        var ultimFechUsoSaldoFavor = ""

        //?: cuando el pago del alumno cancela la deuda
        if (saldoMesI == 0) {
            estado = 'pago_total'
        } else {
            //?: cuando el pago del alumno es mayor a la deuda queda con saldo a favor
            if (saldoMesI > 0) {
                acreedor = saldoMesI
                estado = 'saldo_a_favor'
            }
            //?: cuando el pago del alumno no cancela el total de la deuda sigue qudando con el saldo en negativo
            else {
                deudor = Math.abs(saldoMesI)
                estado = 'pago_parcial'
            }
        }
        var objectpayment
        if (deudaMesI > 0) {
            debe = deudaMesI
        } else {
            debe = precioMesI
        }

        if(datosDB.length == 0){
            //numeroBoleta = 0
            ultimFechUsoSaldoFavor = setDate()
        }else{
            numeroBoleta = datosDB.at(-1).NumeroBoleta
            saldoFavorUsado = 1
            ultimFechUsoSaldoFavor = setDate()
        }

        var numeroBoletaActual = parseInt(numeroBoleta) + 1

        console.log("")
        console.log(`datosDB.length: ${datosDB.length}`)
        console.log("-----------------------------")
        console.log(`la deuda de ${NombreMesI} es de ${deudaMesI}`)
        console.log("-----------------------------")
        console.log(`debe: ${debe}`)
        console.log(`haber: ${haber}`)
        console.log(`saldo acreedor: ${acreedor}`)
        console.log(`saldo deudor: ${deudor}`)
        console.log(`estado: ${estado}`)
        console.log(`precio del mes: ${precioMesI}`)
        console.log(`pago Alumno: ${pagoAlumnoI}`)
        console.log(`usa saldo a favor para pagar?: ${usaSaldoFavorI}`)
        console.log(`Ultimo numero de Boleta: ${numeroBoleta}`)
        console.log(`numeroBoletaActual: ${numeroBoletaActual}`)
        console.log(`saldo a favor usado: ${saldoFavorUsado}`)
        console.log(`ultimFechUsoSaldoFavor: ${ultimFechUsoSaldoFavor}`)
        console.log("-----------------------------")
        console.log("-----------------------------")

        //console.log(`ultimo numero de boleta ${numeroBoleta}`)
        //console.log(`numero de boleta actual ${numeroBoletaActual}`)
        
        if (ArrayNumeroMeses.length > 1) {
            objectpayment = createObjectPayment(numeroBoletaActual, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate(), IdPagoConjunto, saldoFavorUsado, ultimFechUsoSaldoFavor)
        } else {
            objectpayment = createObjectPayment(numeroBoletaActual, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate(), "", saldoFavorUsado, ultimFechUsoSaldoFavor)
        }
        console.log(objectpayment)
        
        const resDB = await objectpayment.save()
        if (resDB) {
            arraySuccesses.push(`el pago ${haber}$ corresponiente al mes de ${NombreMesI} se guardo correctamente`)
        } else {
            arrayErrors.push(`ocurrio un error al tratar de guardar el pago ${haber}$ corresponiente al mes de ${NombreMesI}`)
        } 
    }
    
    const courses = await course.find().sort({ fechaInicioCurso: 'asc' });
    res.render('pagos/selectCourseAddPayment', { courses, arraySuccesses, arrayErrors })
    //res.send(jsonData)
}





paymentControllers.renderShowPay = async (req, res) => {
    const dataDB = await movAcc.find()
    const arrayData = []
    for (let i = 0; i < dataDB.length; i++) {
        //console.log(dataDB[i]);
        var dataCurso = await course.findById(dataDB[i].idCurso)
        var dataAlumno = await alumn.findById(dataDB[i].idAlumno)
        var dataPriceCourse = await priceCourse.findById(dataDB[i].idValorCurso)
        var fechaCreacion = (dataDB[i].fechaCreacion).toLocaleDateString()

        var nombreCurso = dataCurso.nombre
        var nombreAlumno = dataAlumno.nombre + " " + dataAlumno.apellido
        var pagoAlumno = dataDB[i].Haber
        var comentarioPago = dataDB[i].Comentario
        var mes = dataPriceCourse.mes
        var nombreMes = loadNombreMes(mes)

        var resObject = {
            nombreCurso: nombreCurso,
            nombreAlumno: nombreAlumno,
            pagoAlumno: pagoAlumno,
            comentarioPago: comentarioPago,
            nombreMes: nombreMes,
            fechaCreacion: fechaCreacion,
            idCurso: dataDB[i].idCurso,
            idAlumno: dataDB[i].idAlumno,
            idValorCurso: dataDB[i].idValorCurso
        }
        arrayData.push(resObject)
    }
    res.render('pagos/showPayment', { arrayData })
}

paymentControllers.seachTicket = async (req, res) => {
    res.render('pagos/searchTicket')
}

// ------------------------------------------------------------------------ //
// ····················· URLs para mostrar datos ·························· //
// ------------------------------------------------------------------------ //
paymentControllers.returnPriceMonth = async (req, res) => {

}



paymentControllers.priceMonthData = async (req, res) => {
    const mes = req.params.mes
    const valCourse = await priceCourse.find({ mes: mes }).sort({ mes: 1 })
    res.json(valCourse)
}

paymentControllers.loadDebitMonth = async (req, res) => {
    const mes = req.params.mes
    const idAlumno = req.params.idAlumno
    const precioMes = await priceCourse.find({ mes: mes, })
    const idPrecioMes = precioMes[0].id

    const debitMonths = await movAcc.find({
        idValorCurso: idPrecioMes,
        //Estado: 'pago_parcial',
        idAlumno: idAlumno
    })

    const resposeJson = [precioMes[0], debitMonths]
    res.json(resposeJson)
}

paymentControllers.loadMonthData = async (req, res) => {
    const idCourse = req.params.id
    const dataCourse = await course.findById(idCourse)
    const valCourse = await priceCourse.find({ idCurso: idCourse }).sort({ mes: 1 })
    var response = {
        dataCourse: dataCourse,
        dataValueCourse: valCourse
    }
    res.json(response)
}

paymentControllers.loadTotaldata = async (req, res) => {
    var mes = req.params.mes
    var nombreMes = req.params.nombreMes
    var idAlumno = req.params.idAlumno
    var precioMes = await priceCourse.find({ mes: mes, })

    var response = {
        numeroMes: "",
        nombreMes: "",
        saldoFavor: "",
        idAlumno: "",
        usaSaldoFavor: "",
        valorUsoSaldoFavor: "",
    }

    if (precioMes.length != 0) {
        var idPrecioMes = precioMes[0].id

        var requestData = await movAcc.find({
            idValorCurso: idPrecioMes,
            Estado: 'saldo_a_favor',
            idAlumno: idAlumno
        })
        console.log(requestData)

        if (requestData.length > 0) {
            var saldoFavor = requestData.at(-1).SaldoAcreedor
            //res.json({nombreMes: nombreMes, numeroMes: numeroMes, saldoFavor: saldoFavor})
            console.log("------------------------------------------------------")
            console.log("------------------------------------------------------")
            console.log(`numeroMes: ${mes}`)
            console.log(`saldoFavor: ${saldoFavor}`)
            console.log("------------------------------------------------------")
            console.log("------------------------------------------------------")

            response.nombreMes = nombreMes
            response.numeroMes = mes
            response.saldoFavor = saldoFavor
            response.idAlumno = idAlumno
            response.usaSaldoFavor = false
            response.valorUsoSaldoFavor = 0
        }
    }

    res.json(response)
}

paymentControllers.loadAlumndata = async (req, res) => {
    var idAlumno = req.params.idAlumno
    var datosAlumno = await alumn.findById(idAlumno)
    res.json(datosAlumno)
}

// ------------------------------------------------------------------------ //
// ············ funciones para retornar informacion de DB ················· //
// ------------------------------------------------------------------------ //
function createObject(numeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, saldo, comentario, itemsNum, IdPagoConjunto) {
    //const saldo = haber - deudaUltimo
    var deudor = 0
    var acreedor = 0
    estado = null
    //?: cuando el pago del alumno es menor a la deuda queda con saldo negativo
    if (saldo < 0) {
        deudor = Math.abs(saldo)
        estado = 'pago_parcial'
    }
    //?: cuando el pago del alumno es mayor a la deuda queda con saldo a favor
    else {
        acreedor = saldo
        estado = 'saldo_a_favor'
    }
    var objectpayment
    //?: cuando se pagan mas de un mes al mismo tiempo
    if (itemsNum > 1) {
        objectpayment = createObjectPayment(numeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate(), IdPagoConjunto)
    }
    //?: cuando se pagan un solo mes
    else {
        objectpayment = createObjectPayment(numeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate())
    }
    return objectpayment
}

function loadNombreMes(mes) {
    var dataMes = {
        nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    }
    var numeroMes = mes.split('-')[1]
    var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]
    return nombreMes
}

function createObjectPayment(NumeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, fechaDB, IdPagoConjunto, saldoFavorUsado, ultimFechUsoSaldoFavor) {
    //* guardamos en DB 
    console.log(`NumeroBoleta: ${NumeroBoleta}`)
    console.log(`idCurso: ${idCurso}`)
    console.log(`idAlumno: ${idAlumno}`)
    console.log(`debe: ${debe}`)
    console.log(`haber: ${haber}`)
    console.log(`deudor: ${deudor}`)
    console.log(`acreedor: ${acreedor}`)
    console.log(`estado: ${estado}`)
    console.log(`comentario: ${comentario}`)
    console.log(`fechaDB: ${fechaDB}`)
    console.log(`IdPagoConjunto: ${IdPagoConjunto}`)
    console.log(`saldoFavorUsado: ${saldoFavorUsado}`)
    console.log(`ultimFechUsoSaldoFavor: ${ultimFechUsoSaldoFavor}`)
    var MovAccount
    if (IdPagoConjunto != "") {
        MovAccount = new movAcc({
            NumeroBoleta: NumeroBoleta,
            idCurso: idCurso,
            idAlumno: idAlumno,
            idValorCurso: idValorCurso,
            Debe: debe,
            Haber: haber,
            SaldoDeudor: deudor,
            SaldoAcreedor: acreedor,
            saldoFavorUsado: saldoFavorUsado,
            ultimFechUsoSaldoFavor: ultimFechUsoSaldoFavor,
            Estado: estado,
            IdPagoConjunto: IdPagoConjunto,
            Comentario: comentario,
            fechaCreacion: fechaDB
        })
    } else {
        MovAccount = new movAcc({
            NumeroBoleta: NumeroBoleta,
            idCurso: idCurso,
            idAlumno: idAlumno,
            idValorCurso: idValorCurso,
            Debe: debe,
            Haber: haber,
            SaldoDeudor: deudor,
            SaldoAcreedor: acreedor,
            saldoFavorUsado: saldoFavorUsado,
            ultimFechUsoSaldoFavor: ultimFechUsoSaldoFavor,
            Estado: estado,
            Comentario: comentario,
            fechaCreacion: fechaDB
        })
    }
    return MovAccount
}

function setDate() {
    //* Seteamos el Date para que se guarde correctamente en DB
    var date = new Date()
    const dateParse = new movAcc({
        fechaCreacion: date,
        offset: date.getTimezoneOffset()
    })
    return new Date(dateParse.fechaCreacion.getTime() - (dateParse.offset * 60000));
}




module.exports = paymentControllers