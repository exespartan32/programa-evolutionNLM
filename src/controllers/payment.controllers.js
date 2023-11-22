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


    var nuevoArrayMeses = []
    var nuevoArraypagos = []

    for (let i = 0; i < arrayMeses.length; i++) {
        var mesI = arrayMeses[i]
        var pagoI = arrayPagos[i]
        if (mesI && pagoI) {
            nuevoArrayMeses.push(mesI)
            nuevoArraypagos.push(pagoI)
        }
    }

    console.log(nuevoArrayMeses)
    console.log(nuevoArraypagos)

    if (nuevoArrayMeses.length == nuevoArraypagos.length) {
        var itemsNum = nuevoArrayMeses.length
        var IdPagoConjunto = new mongoose.Types.ObjectId();
        var contador = 0
        for (let i = 0; i < itemsNum; i++) {
            // variables globales
            var mesI = arrayMeses[i]
            var pagoI = arrayPagos[i]
            var nombreMes = loadNombreMes(mesI)
            contador++

            // valiables del curso
            const valCourse = await valorCurso.find({ mes: mesI, idCurso: idCurso })
            var idValorCurso = valCourse[0].id

            // variables de balance
            var debe = valCourse[0].precioMes
            var haber = pagoI
            var saldo = haber - debe
            var deudor = 0
            var acreedor = 0
            var estado = null

            // variables de busqueda
            const findDebtMonth_MovAcc = await movAcc.find({ idAlumno: idAlumno, idValorCurso: idValorCurso, Estado: 'pago_parcial' })
            const findAll_MovAcc = await movAcc.find()
            const numeroRegistros = findAll_MovAcc.length
            const numeroBoleta = contador + numeroRegistros

            console.log("contador Nº : " + contador)

            if (findAll_MovAcc.length > 0) {
                if (findDebtMonth_MovAcc.length > 0) {
                    if (findAll_MovAcc.length > 1) {
                        const ultimoRegistro = findDebtMonth_MovAcc.at(-1)
                        const deudaUltimo = ultimoRegistro.SaldoDeudor
                        saldo = haber - deudaUltimo
                        const object = createObject(numeroBoleta, idCurso, idAlumno, idValorCurso, deudaUltimo, haber, saldo, comentario, itemsNum, IdPagoConjunto)
                        console.log(object)

                        const resDB = await object.save()
                        if (resDB) {
                            arraySuccesses.push(`el pago de ${haber}$ correspondientes al mes de ${nombreMes} se guardo correctamente`)
                        } else {
                            arrayErrors.push(`ocurrio un error al tratar de guardar el pago ${haber}$ correspondientes al mes de ${nombreMes}`)
                        }
                    } else {
                        const deudaUltimo = findDebtMonth_MovAcc[0].SaldoDeudor
                        saldo = haber - deudaUltimo
                        const object = createObject(numeroBoleta, idCurso, idAlumno, idValorCurso, deudaUltimo, haber, saldo, comentario, itemsNum, IdPagoConjunto)
                        console.log(object)

                        const resDB = await object.save()
                        if (resDB) {
                            arraySuccesses.push(`el pago de ${haber}$ correspondientes al mes de ${nombreMes} se guardo correctamente`)
                        } else {
                            arrayErrors.push(`ocurrio un error al tratar de guardar el pago ${haber}$ correspondientes al mes de ${nombreMes}`)
                        }
                    }
                } else {
                    const object = createObject(numeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, saldo, comentario, itemsNum, IdPagoConjunto)
                    console.log(object)
                    const resDB = await object.save()
                    if (resDB) {
                        arraySuccesses.push(`el pago de ${haber}$ correspondientes al mes de ${nombreMes} se guardo correctamente`)
                    } else {
                        arrayErrors.push(`ocurrio un error al tratar de guardar el pago ${haber}$ correspondientes al mes de ${nombreMes}`)
                    }
                }   
            } else {
                console.log("no existen registros en DB")
            }
        }
        const courses = await course.find().sort({ fechaInicioCurso: 'asc' });
        //res.render('pagos/selectCourseAddPayment', { courses, arraySuccesses, arrayErrors })
    } else {
        errors.push({ text: 'ha ocurrido un error al enviar los datos' })
        res.render('pagos/selectCourseAddPayment', { errors })
    }





}

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
    if (itemsNum > 1) {
        objectpayment = createObjectPayment(numeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, setDate(), IdPagoConjunto)
    } else {
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

function createObjectPayment(NumeroBoleta, idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, fechaDB, IdPagoConjunto) {
    //* guardamos en DB 
    var MovAccount
    if (IdPagoConjunto) {
        MovAccount = new movAcc({
            NumeroBoleta: NumeroBoleta,
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
            NumeroBoleta: NumeroBoleta,
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