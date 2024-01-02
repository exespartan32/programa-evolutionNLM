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
    const ArrayPagoAlumno = jsonData.pagoAlumno
    const ArraySaldoMes = jsonData.saldoMes
    const ArrayDeudaMes = jsonData.deuda
    const ArrayUsoSaldoFavor = jsonData.usoSaldoFavor
    const ArrayComentario = jsonData.comentario
    const ArrayNombreMesSaldoFavor = jsonData.nombreMesSaldoFavor
    const ArrayNumeroMesSaldoFavor = jsonData.numeroMesSaldoFavor
    const ArraySaldoFavorOriginal = jsonData.saldoFavorOriginal
    const ArraySaldoFavorUsado = jsonData.saldoFavorUsado
    const arraySuccesses = []
    const arrayErrors = []
    var IdPagoConjunto = new mongoose.Types.ObjectId();

    for (let i = 0; i < ArrayNumeroMeses.length; i++) {
        //#: datos de cada item
        var NombreMesI = ArrayNombreMeses[i]
        var NumeroMesI = ArrayNumeroMeses[i]
        var precioMesI = ArrayPrecioMes[i]
        var saldoMesI = ArraySaldoMes[i]
        var deudaMesI = ArrayDeudaMes[i]
        var pagoAlumnoI = ArrayPagoAlumno[i]
        var usaSaldoFavorI = ArrayUsoSaldoFavor[i]
        var comentarioI = ArrayComentario[i]
        var nombreMesSaldoFavorI = ArrayNombreMesSaldoFavor[i]
        var saldoFavorOriginalI = ArraySaldoFavorOriginal[i]
        var saldoFavorUsadoI = ArraySaldoFavorUsado[i]
        var numeroMesSaldoFavorI = ArrayNumeroMesSaldoFavor[i]

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
        var ultimFechUsoSaldoFavor = null
        var saldoFavorTotalUsado = 0

        //?: 1) calculamos el numero de boleta 
        if (datosDB.length > 0) {
            numeroBoleta = datosDB.at(-1).NumeroBoleta
        }
        var numeroBoletaActual = parseInt(numeroBoleta) + 1

        //?: 2) calculamos si tiene deuda o saldo a favor
        if (saldoMesI != 0) {
            if (saldoMesI > 0) {
                acreedor = saldoMesI
                estado = 'saldo_a_favor'
            }
            if (saldoMesI < 0) {
                deudor = Math.abs(saldoMesI)
                estado = 'pago_parcial'
            }
        } else { estado = 'pago_total' }

        //?: 2) si el mes pagado tiene deuda el haber es la deuda 
        //?:    en caso contrario el haber sera el precio del mes
        if (deudaMesI > 0) {
            debe = deudaMesI
        } else {
            debe = precioMesI
        }

        //?: 3) modificamos el registro del mes con el saldo a favor usado
        if (usaSaldoFavorI == true) {
            const valCourseSaldoFavor = await valorCurso.find({ mes: numeroMesSaldoFavorI, idCurso: idCurso })
            var idValorCursoSaldoFavor = valCourseSaldoFavor[0]._id

            for (let j = 0; j < ArraySaldoFavorUsado.length; j++) {
                if (ArrayNombreMesSaldoFavor[i] == ArrayNombreMesSaldoFavor[j]) {
                    saldoFavorTotalUsado += ArraySaldoFavorUsado[j]
                }
            }

            const saldoFavorUsadoDB = await movAcc.find({
                idCurso: idCurso,
                idAlumno: idAlumno,
                idValorCurso: idValorCursoSaldoFavor,
                Estado: "saldo_a_favor"
            })

            saldoFavorTotalUsado += saldoFavorUsadoDB[0].saldoAcreedorUsado

            var datosDBSaldoFavor = await movAcc.findOneAndUpdate({
                idCurso: idCurso,
                idAlumno: idAlumno,
                idValorCurso: idValorCursoSaldoFavor
            }, {
                saldoAcreedorUsado: saldoFavorTotalUsado,
                ultimFechUsoSaldoFavor: setDate()
            })

            if (datosDBSaldoFavor) {
                console.log("el registro del saldo a favor usado se actualizo correctamente")
            } else {
                console.log("¡ERROR! el registro del saldo a favor usado no se pudo actualizar")
            }
        }

        if (ArrayNumeroMeses.length > 1) {
            objectpayment = createObjectPayment(numeroBoletaActual, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentarioI, setDate(), IdPagoConjunto, 0, ultimFechUsoSaldoFavor)
        } else {
            objectpayment = createObjectPayment(numeroBoletaActual, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentarioI, setDate(), "", 0, ultimFechUsoSaldoFavor)
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
            response.nombreMes = nombreMes
            response.numeroMes = mes
            response.saldoFavor = saldoFavor
            response.idAlumno = idAlumno
            response.usaSaldoFavor = false
            response.valorUsoSaldoFavor = requestData.at(-1).saldoAcreedorUsado
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
            saldoAcreedorUsado: saldoFavorUsado,
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
            saldoAcreedorUsado: saldoFavorUsado,
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