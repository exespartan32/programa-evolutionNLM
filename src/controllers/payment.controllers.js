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

    //% 1) cuando el es ingresado tiene precio asignado
    if (valCourse.length > 0) {
        idValorCurso = valCourse[0].id
        debe = valCourse[0].precioMes

        //* buscamos si hay datos en DB
        const searchDataTotal = await movAcc.find({})
        //% 1.1) cuando no hay datos enteriores se crea el primer registro
        if (searchDataTotal.length == 0) {
            saldoFavor = debe - haber

            if (saldoFavor < 0) { acreedor = Math.abs(saldoFavor) }
            if (haber < debe) { deudor = saldoFavor }

            const resPayment = savePayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, comentario, fechaDB)
            //res.send(resPayment)
            await resPayment.save()
            req.flash('success_msg', 'el pago fue guardado correctamente')
            res.redirect('/payment/selectCourseAddPay')
        }
        //% 1.2) cuando ya existen registros en DB crea nuevos
        else{
            
        }
        
    }
    //! 2) si el mes seleccionado a pagar no tiene precio nos devuelve un mensaje de error
    else {
        req.flash('error_msg', 'el mes seleccionado no tiene un precio guardado')
        res.redirect('/payment/selectCourseAddPay')
    }
}

function FunsaldoActual(debe, haber, positiveBalance, negativeBalance) {
    var balanceActual = 0

    if (positiveBalance > 0) { balanceActual = parseInt(haber) + parseInt(positiveBalance) }
    if (negativeBalance > 0) { balanceActual = parseInt(haber) - parseInt(negativeBalance) }
    if (balanceActual < 0) { balanceActual = Math.abs(balanceActual) }

    var saldoActual = balanceActual - debe


    return saldoActual
}

function balanceDB(balance, action) {
    var debitTotal = 0
    //* retornamos el saldo a favor del alumno
    if (balance.length == 1) {
        debitTotal = balance[0].action
    } else {
        for (var i = 0; i < balance.length; i++) {
            var debitIndividual = balance[i].action
            debitTotal = debitTotal + debitIndividual
        }
    }
    return debitTotal
}


function savePayment(idCurso, idAlumno, idValorCurso, debe, haber, deudor, acreedor, comentario, fechaDB) {
    //* guardamos en DB 
    const MovAccount = new movAcc({
        idCurso: idCurso,
        idAlumno: idAlumno,
        idValorCurso: idValorCurso,
        Debe: debe,
        Haber: haber,
        Deudor: deudor,
        Acreedor: acreedor,
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


paymentControllers.renderShowPay = async (req, res) => {

}




module.exports = paymentControllers