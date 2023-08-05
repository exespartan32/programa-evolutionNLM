const paymentControllers = {};
const course = require('../models/curso')
const alumn = require('../models/alumno')
const priceCourse = require('../models/valorCurso');
const movAlumn = require('../models/movimientoDeAlumno')
const movAcc = require('../models/movimientoDeCuenta')
const movDebit = require('../models/movimientoDeSaldo')


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

    //* recorremos la lista de MovAlumn
    //* buscamos los alumnos que tiene el curso
    //* agregamos los alumnos del curso a la lista alumnList
    const alumnList = []
    for (let i = 0; i < listMovAlumn.length; i++) {
        const idAlumn = listMovAlumn[i].idAlumno
        const alumnData = await alumn.findById(idAlumn)
        alumnList.push(alumnData)
    }
    res.render('pagos/addPayment', { dataCourse, alumnList })
}

// ------------------------- 2) guardamos el pago --------------------- //
paymentControllers.savePayment = async (req, res) => {
    const idCurso = req.params.id
    const { mes, pagoAlumno, idAlumno, comentario } = req.body

    //* recuperamos de db la lista con los precios de cada mes del curso
    const valCourse = await priceCourse.find({
        idCurso: { $eq: idCurso },
        mes: mes,
    })
    var idValorCurso = null
    var debe = null
    var haber = pagoAlumno
    var deudor = 0
    var acreedor = 0
    var fechaDB = setDate()
    var estado

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
    }
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




module.exports = paymentControllers