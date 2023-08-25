const paymentControllers = {};
const course = require('../models/curso')
const alumn = require('../models/alumno')
const priceCourse = require('../models/valorCurso');
const movAlumn = require('../models/movimientoDeAlumno')
const movAcc = require('../models/movimientoDeCuenta')
const movDebit = require('../models/movimientoDeSaldo')
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
    //console.log(courses)
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
    const arrayMeses = [req.body.mes, req.body.mes2, req.body.mes3, req.body.mes4, req.body.mes5, req.body.mes6, req.body.mes7, req.body.mes8, req.body.mes9, req.body.mes10, req.body.mes11, req.body.mes12]
    const arrayPagos = [req.body.pagoAlumno1, req.body.pagoAlumno2, req.body.pagoAlumno3, req.body.pagoAlumno4, req.body.pagoAlumno5, req.body.pagoAlumno6, req.body.pagoAlumno7, req.body.pagoAlumno8, req.body.pagoAlumno9, req.body.pagoAlumno10, req.body.pagoAlumno11, req.body.pagoAlumno12]


    console.log(arrayMeses)
    console.log(arrayPagos)






    for (let i = 0; i < arrayMeses.length; i++) {
        var mesI = arrayMeses[i]
        var pagoI = arrayPagos[i]

        if (mesI && pagoI) {
            console.log("datos del mes Nº " + i + " : " + mesI)
            console.log("datos del pago Nº " + i + " : " + pagoI)

            const valCourse = await valorCurso.find({ mes: mesI, idCurso: idCurso })

            //console.log(valCourse)

            var idValorCurso = valCourse[0].id
            var debe = valCourse[0].precioMes
            var haber = pagoI
            var saldo = haber - debe
            var deudor = 0
            var acreedor = 0
            var estado = null

            const seachPaymentMonth = await movAcc.find({
                idAlumno: idAlumno,
                idCurso: idCurso,
                idValorCurso: idValorCurso
            })
            // #: cuando el mes seleccionado no ha sido pagado con anterioridad
            if (seachPaymentMonth.length == 0) {
                console.log("primer pago")
                /*
                if (saldo < 0) {
                    console.log("debe dinero")
                    deudor = Math.abs(saldo)
                    estado = 'pago_parcial'
                } else {
                    if (saldo == 0) {
                        console.log("paga justo")
                        acreedor = Math.abs(saldo)
                        estado = 'pago_total'
                    } else {
                        console.log("paga demas")
                        acreedor = Math.abs(saldo)
                        estado = 'saldo_a_favor'
                    }

                    const MovAccount = new movAcc({
                        idCurso: idCurso,
                        idAlumno: idAlumno,
                        idValorCurso: idValorCurso,
                        Debe: debe,
                        Haber: haber,
                        SaldoDeudor: deudor,
                        SaldoAcreedor: acreedor,
                        Estado: estado,
                        Comentario: comentario,
                        fechaCreacion: setDate()
                    })

                    console.log(MovAccount)

                     const resDB = await MovAccount.save()
                    if (resDB) {
                        req.flash('success_msg', 'pago agreado correctamente');
                        res.redirect('/payment/selectCourseAddPay')
                    } else {
                        req.flash('error_msg', 'ha ocurrido un error al guardar en base de datos');
                        res.redirect('/payment/selectCourseAddPay')
                    } 
                }
                */
            }
            // #: cuando el mes seleccionado ya ha sido pagado con anterioridad
            else {
                if (seachPaymentMonth.Estado == "pago_parcial") {
                    console.log('el mes seleccionado ya ha sido pagado pero tiene deuda')
                } else {
                    console.log('el mes seleccionado ya ha sido pagado')
                }
            }
        }
    }

    res.send(req.body)















    /* 
        //% 1) cuando el es ingresado tiene precio asignado
        if (valCourse.length > 0) {
            idValorCurso = valCourse[0].id
            debe = valCourse[0].precioMes
            saldo = haber - debe
    
            const seachPaymentMonth = await movAcc.find({
                idAlumno: idAlumno,
                idCurso: idCurso,
                idValorCurso: idValorCurso
            })
    
            if (seachPaymentMonth == 0) {
                if (saldo < 0) {
                    console.log("debe dinero")
                    deudor = Math.abs(saldo)
                    estado = 'pago_parcial'
                } else {
                    if (saldo == 0) {
                        console.log("paga justo")
                        acreedor = Math.abs(saldo)
                        estado = 'pago_total'
                    } else {
                        console.log("paga demas")
                        acreedor = Math.abs(saldo)
                        estado = 'saldo_a_favor'
                    }
                }
                const MovAccount = new movAcc({
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
    
                const resDB = await MovAccount.save()
                if (resDB) {
                    req.flash('success_msg', 'pago agreado correctamente');
                    res.redirect('/payment/selectCourseAddPay')
                } else {
                    req.flash('error_msg', 'ha ocurrido un error al guardar en base de datos');
                    res.redirect('/payment/selectCourseAddPay')
                }
    
                //res.send(MovAccount)
            }
            else {
                if (seachPaymentMonth.Estado == "pago_parcial") {
                    req.flash('error_msg', 'el mes seleccionado ya ha sido pagado pero tiene deuda');
                    //res.redirect('/payment/selectCourseAddPay')
                } else {
                    req.flash('error_msg', 'el mes seleccionado ya ha sido pagado');
                    res.redirect('/payment/selectCourseAddPay')
                }
    
            }
    
        }
        //! 2) si el mes seleccionado a pagar no tiene precio nos devuelve un mensaje de error
        else {
            req.flash('error_msg', 'el mes seleccionado no tiene un precio guardado')
            res.redirect('/payment/selectCourseAddPay')
        } */
}


function savePayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, saldoTotalAlumno, estado, comentario, fechaDB) {
    //* guardamos en DB 
    const MovAccount = new movAcc({
        idCurso: idCurso,
        idAlumno: idAlumno,
        idValorCurso: idValorCurso,
        Debe: debe,
        Haber: haber,
        SaldoDeudor: deudor,
        SaldoAcreedor: acreedor,
        SaldoTotalAlumno: saldoTotalAlumno,
        Estado: estado,
        Comentario: comentario,
        fechaCreacion: fechaDB
    })
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


paymentControllers.renderPreviusMonth = async (req, res) => {

}

paymentControllers.renderShowPay = async (req, res) => {

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
    const precioMes = await priceCourse.find({ mes: mes })
    const idPrecioMes = precioMes[0].id
    const debitMonths = await movAcc.find({
        idValorCurso: idPrecioMes,
        Estado: 'pago_parcial'
    })
    //console.log("los pagos de ese mes son: ")
    //console.log(debitMonths)
    res.json(debitMonths.at(-1))
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