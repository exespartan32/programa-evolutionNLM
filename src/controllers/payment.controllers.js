const paymentControllers = {};
const mongoose = require('mongoose');
const course = require('../models/curso')
const alumn = require('../models/alumno')
const priceCourse = require('../models/valorCurso');
const movAlumn = require('../models/movimientoDeAlumno')
const movAcc = require('../models/movimientoDeCuenta')
const functionspayment = require('./functionsPaymentControllers');
const valorCurso = require('../models/valorCurso');
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
    res.render('pagos/addPayment', { dataCourse, alumnList, numerMonth })
}

// ------------------------- 2) guardamos el pago --------------------- //
paymentControllers.savePayment = async (req, res) => {
    const idCurso = req.params.id
    const { idAlumno, comentario } = req.body
    const arrayMeses = [req.body.mes1, req.body.mes2, req.body.mes3, req.body.mes4, req.body.mes5, req.body.mes6, req.body.mes7, req.body.mes8, req.body.mes9, req.body.mes10, req.body.mes11, req.body.mes12]
    const arrayPagos = [req.body.pagoAlumno1, req.body.pagoAlumno2, req.body.pagoAlumno3, req.body.pagoAlumno4, req.body.pagoAlumno5, req.body.pagoAlumno6, req.body.pagoAlumno7, req.body.pagoAlumno8, req.body.pagoAlumno9, req.body.pagoAlumno10, req.body.pagoAlumno11, req.body.pagoAlumno12]

    const arraySuccesses = []
    const arrayErrors = []

    var IdPagoConjunto = new mongoose.Types.ObjectId();
    var arrayNew = []

    for (let i = 0; i < arrayMeses.length; i++) {
        var mesI = arrayMeses[i]
        var pagoI = arrayPagos[i]
        if (mesI && pagoI) arrayNew.push(mesI)
    }
    for (let i = 0; i < arrayMeses.length; i++) {
        var mesI = arrayMeses[i]
        var pagoI = arrayPagos[i]

        if (mesI && pagoI) {
            const valCourse = await valorCurso.find({ mes: mesI, idCurso: idCurso })

            var nombreMes = loadNombreMes(mesI)

            var idValorCurso = valCourse[0].id
            var debe = valCourse[0].precioMes
            var haber = pagoI
            var saldo = haber - debe
            var deudor = 0
            var acreedor = 0
            var estado = null

            const debtMonth = await movAcc.find({ idAlumno: idAlumno, idValorCurso: idValorCurso, Estado: 'pago_parcial' })

            //#: cuando el mes seleccionado tiene una deuda anterior
            if (debtMonth.length > 0) {
                debe = debtMonth[0].SaldoDeudor
                saldo = haber - debe
                //?: cuando el pago del alumno cancela la deuda
                if (saldo == 0) {
                    estado = 'pago_total'
                } else {
                    //?: cuando el pago del alumno es mayor a la deuda queda con saldo a favor
                    if (saldo > 0) {
                        acreedor = saldo
                        estado = 'saldo_a_favor'
                    }
                    //?: cuando el pago del alumno no cancela el total de la deuda sigue qudando con el saldo en negativo
                    else {
                        deudor = Math.abs(saldo)
                        estado = 'pago_parcial'
                    }
                }

                var objectpayment
                if (arrayNew.length > 1) {
                    objectpayment = createObjectPayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate(), IdPagoConjunto)
                } else {
                    objectpayment = createObjectPayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate())
                }
                //console.log(objectpayment)
                const resDB = await objectpayment.save()
                if (resDB) {
                    arraySuccesses.push(`el pago ${debe}$ del mes de ${nombreMes} se guardo correctamente`)
                } else {
                    arrayErrors.push(`ocurrio un error al tratar de guardar el pago ${debe}$ del mes de ${nombreMes}`)
                } /**/
            }
            //#: cuando el mes seleccionado no posee deuda anterior
            else {
                //?: cuando el pago del alumno cancela la deuda
                if (saldo == 0) {
                    estado = 'pago_total'
                } else {
                    //?: cuando el pago del alumno es mayor a la deuda queda con saldo a favor
                    if (saldo > 0) {
                        acreedor = saldo
                        estado = 'saldo_a_favor'
                    }
                    //?: cuando el pago del alumno no cancela el total de la deuda sigue qudando con el saldo en negativo
                    else {
                        deudor = Math.abs(saldo)
                        estado = 'pago_parcial'
                    }
                }

                var objectpayment
                if (arrayNew.length > 1) {
                    objectpayment = createObjectPayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate(), IdPagoConjunto)
                } else {
                    objectpayment = createObjectPayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate())
                }
                const resDB = await objectpayment.save()
                if (resDB) {
                    arraySuccesses.push(`el pago ${debe}$ del mes de ${nombreMes} se guardo correctamente`)
                } else {
                    arrayErrors.push(`ocurrio un error al tratar de guardar el pago ${debe}$ del mes de ${nombreMes}`)
                } /* */
            }
        }
    }
    const courses = await course.find().sort({ fechaInicioCurso: 'asc' });
    res.render('pagos/selectCourseAddPayment', { courses, arraySuccesses, arrayErrors })
}

function loadNombreMes(mes){
    var dataMes = {
        nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    }
    var numeroMes = mes.split('-')[1]
    var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]
    return nombreMes
}

function createObjectPayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, fechaDB, IdPagoConjunto) {
    //* guardamos en DB 
    var MovAccount
    if (IdPagoConjunto) {
        MovAccount = new movAcc({
            idCurso: idCurso,
            idAlumno: idAlumno,
            idValorCurso: idValorCurso,
            Debe: debe,
            Haber: haber,
            SaldoDeudor: deudor,
            SaldoAcreedor: acreedor,
            Estado: estado,
            IdPagoConjunto: IdPagoConjunto,
            Comentario: comentario,
            fechaCreacion: fechaDB
        })
    } else {
        MovAccount = new movAcc({
            idCurso: idCurso,
            idAlumno: idAlumno,
            idValorCurso: idValorCurso,
            Debe: debe,
            Haber: haber,
            SaldoDeudor: deudor,
            SaldoAcreedor: acreedor,
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


paymentControllers.renderShowPay = async (req, res) => {
    const dataDB = await movAcc.find()
    const arrayData = []
    for (let i = 0; i < dataDB.length ; i++) {
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
// ············ funciones para retornar informacion de DB ················· //
// ------------------------------------------------------------------------ //
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



module.exports = paymentControllers