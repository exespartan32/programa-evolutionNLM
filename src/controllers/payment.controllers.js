const paymentControllers = {};
const mongoose = require('mongoose');
const course = require('../models/curso')
const alumn = require('../models/alumno')
const priceCourse = require('../models/valorCurso');
const movAlumn = require('../models/movimientoDeAlumno')
const movAcc = require('../models/movimientoDeCuenta')
const valorCurso = require('../models/valorCurso');
const PDF = require('pdfkit-construct')
const fs = require('fs');
const { bufferedPageRange } = require('pdfkit');
const { Stream } = require('stream');
const { join } = require('path');
const curso = require('../models/curso');
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

    var dataMes = {
        nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        numeroAño: ['2023', '2024']
    }

    var datosMeses = {
        numerMonth: [],
        nameMonth: []
    }

    for (let i = 0; i < valCourse.length; i++) {
        const month = (valCourse[i].mes.split("-"))[1]
        datosMeses.numerMonth.push(valCourse[i].mes)

        for (let j = 0; j < dataMes.numeroMes.length; j++) {
            if (month == dataMes.numeroMes[j]) {
                datosMeses.nameMonth.push(dataMes.nombreMes[j])
            }
        }
    }

    //* recorremos la lista de MovAlumn
    //* buscamos los alumnos que tiene el curso
    //* agregamos los alumnos del curso a la lista alumnList
    const alumnList = []
    for (let i = 0; i < listMovAlumn.length; i++) {
        const idAlumn = listMovAlumn[i].idAlumno
        const alumnData = await alumn.findById(idAlumn)
        alumnList.push(alumnData)
    }
    res.render('pagos/agregarPago', { dataCourse, alumnList, datosMeses })
}

// ------------------------- 2) guardamos el pago --------------------- //
paymentControllers.savePayment = async (req, res) => {
    //TODO:  datos recibidos desde el formulario
    const idCurso = req.params.id
    const { idAlumno, dataTotal } = req.body

    const transformData = dataTotal.replace(/['"]+/g, '"');
    const jsonData = JSON.parse(transformData)

    //res.send(req.body)

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
    const ArrayIdMesSaldoFavor = jsonData.IdMesSaldoFavor
    const arraySuccesses = []
    const arrayErrors = []
    var IdPagoConjunto = new mongoose.Types.ObjectId();

    var arrayObjetosPagos = []

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
        var IdMesSaldoFavorI = ArrayIdMesSaldoFavor[i]

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

        var saldoFavorUsado = 0
        var IdMesUsoSaldoAcreedor = null
        var saldoFavorUsado = 0
        var ultimFechUsoSaldoAcreedor = null

        //?: 3) modificamos el registro del mes con el saldo a favor usado
        if (usaSaldoFavorI == true) {
            var IdMes = mongoose.Types.ObjectId(IdMesSaldoFavorI)
            IdMesUsoSaldoAcreedor = IdMes
            saldoFavorUsado = saldoFavorUsadoI

            for (let j = 0; j < ArraySaldoFavorUsado.length; j++) {
                if (ArrayNombreMesSaldoFavor[i] == ArrayNombreMesSaldoFavor[j]) {
                    saldoFavorTotalUsado += ArraySaldoFavorUsado[j]
                }
            }

            const saldoFavorUsadoDB = await movAcc.findById(IdMes)
            saldoFavorTotalUsado += saldoFavorUsadoDB.saldoAcreedorUsado_Total

            //console.log(`saldoFavorTotalUsado: ${saldoFavorTotalUsado}`)

            var datosDBSaldoFavor = await movAcc.findOneAndUpdate({
                _id: IdMes,
            }, {
                saldoAcreedorUsado_Total: saldoFavorTotalUsado,
                ultimFechUsoSaldoAcreedor: setDate(),
            });

            if (datosDBSaldoFavor) {
                console.log("el registro del saldo a favor usado se actualizo correctamente")
            } else {
                console.log("¡ERROR! el registro del saldo a favor usado no se pudo actualizar")
            }
        }

        const datMovAlumn = await movAlumn.findOne({ idCurso: idCurso, idAlumno: idAlumno })
        const idMovAlumn = datMovAlumn._id

        var objectpayment
        if (ArrayNumeroMeses.length > 1) {
            objectpayment = createObjectPayment(
                numeroBoletaActual,
                idMovAlumn,
                idValorCurso,
                debe,
                haber,
                deudor,
                acreedor,
                estado,
                comentarioI,
                setDate(),
                IdPagoConjunto,
                saldoFavorUsado,
                IdMesUsoSaldoAcreedor,
                ultimFechUsoSaldoAcreedor,
            )

        } else {
            IdPagoConjunto = ""
            objectpayment = createObjectPayment(
                numeroBoletaActual,
                idMovAlumn,
                idValorCurso,
                debe,
                haber,
                deudor,
                acreedor,
                estado,
                comentarioI,
                setDate(),
                IdPagoConjunto,
                saldoFavorUsado,
                IdMesUsoSaldoAcreedor,
                ultimFechUsoSaldoAcreedor,
            )
        }
        arrayObjetosPagos.push(objectpayment)

        const resDB = await objectpayment.save()
        if (resDB) {
            arraySuccesses.push(`el pago de la cuota de ${NombreMesI} se guardo correctamente`)
        } else {
            arrayErrors.push(`ocurrio un error al tratar de guardar el pago el pago de la cuota de ${NombreMesI}`)
        }
    }
    const courses = await course.find().sort({ fechaInicioCurso: 'asc' });

    const objetosPagos = JSON.stringify(arrayObjetosPagos)
    const objetoDatosHTML = dataTotal

    if (arrayErrors.length == 0) { arrayErrors.push("-") }

    var stringArraySuccesses = arraySuccesses.toString()
    var stringArrayErrors = arrayErrors.toString()

    var coursesData = JSON.stringify(courses)

    res.redirect(`/payment/renderDataPDF/${objetosPagos}/${objetoDatosHTML}/${stringArraySuccesses}/${stringArrayErrors}/${coursesData}`)
}

paymentControllers.renderShowPay = async (req, res) => {
    const dataDB = await movAcc.find()
    const arrayData = []
    for (let i = 0; i < dataDB.length; i++) {

        // #: -------- datos de movimientoDeAlumno ------- :# //
        var idMovAlumn = dataDB[i].idMovimientoAlumno
        var dataMovimientoAlumno = await movAlumn.findById(idMovAlumn)

        // #: --------------  fecha de pago -------------- :# //
        var fechaCreacion = (dataDB[i].fechaCreacion).toLocaleDateString()

        // #: ----------- datos de valorCurso ------------ :# //
        var dataPriceCourse = await priceCourse.findById(dataDB[i].idValorCurso)

        // #: ----- datos del numero del mes y año ------- :# //
        var mes = dataPriceCourse.mes

        // #: -------- datos del nombre del mes ---------- :# //
        var nombreMes = loadNombreMes(mes)

        // #: ------ datos del curso ------ :# //
        var dataCurso = await course.findById(dataPriceCourse.idCurso)

        // #: ------- datos del alumno -------- :# //
        var idAlumno = dataMovimientoAlumno.idAlumno
        var datosAlumno = await alumn.findById(idAlumno)

        var deudaAnterior = 0
        if (dataDB[i].SaldoDeudor > 0) {
            deudaAnterior = dataDB[i].SaldoDeudor
        }

        var IdPagoConjunto = ""
        if (dataDB[i].IdPagoConjunto != undefined) {
            IdPagoConjunto = dataDB[i].IdPagoConjunto
        }

        var mesSaldoFavor = "-"
        var nombreMesSaldoFavor = "-"
        var saldoAcreedor = 0
        var saldoAcreedorUsado_Total = 0

        if (dataDB[i].IdMesUsoSaldoAcreedor != null) {
            var id = dataDB[i].IdMesUsoSaldoAcreedor
            mesSaldoFavor = await movAcc.findById(id)

            var dataMes = await priceCourse.findById(mesSaldoFavor.idValorCurso)
            nombreMesSaldoFavor = loadNombreMes(dataMes.mes)

            saldoAcreedor = mesSaldoFavor.SaldoAcreedor
            saldoAcreedorUsado_Total = mesSaldoFavor.saldoAcreedorUsado_Total
        }

        var saldo = 0
        var pagoAlumno = dataDB[i].Haber
        var precioMes = dataPriceCourse.precioMes

        if (saldoAcreedorUsado_Total > 0) {
            if (deudaAnterior > 0) {
                saldo = parseInt(pagoAlumno) + parseInt(saldoAcreedorUsado_Total) - parseInt(deudaAnterior)
            } else {
                saldo = parseInt(pagoAlumno) + parseInt(saldoAcreedorUsado_Total) - parseInt(precioMes)
            }
        } else {
            if (deudaAnterior > 0) {
                saldo = parseInt(pagoAlumno) - parseInt(deudaAnterior)
            } else {
                saldo = parseInt(pagoAlumno) - parseInt(precioMes)
            }
        }

        var resObject = {
            nombreAlumno: datosAlumno.nombre,
            apellidoAlumno: datosAlumno.apellido,
            DNI: datosAlumno.DNI,
            nombreCurso: dataCurso.nombre,
            nombreMes: nombreMes,
            numeroMes: mes,
            precioMes: precioMes,
            pagoAlumno: pagoAlumno,
            comentario: dataDB[i].Comentario,

            saldoMes: saldo,
            deudaAnterior: deudaAnterior,
            nombreMesSaldoFavor: nombreMesSaldoFavor,

            saldoFavorOriginal: saldoAcreedor,
            saldoFavorUsado: saldoAcreedorUsado_Total,

            idObjeto: dataDB[i]._id,
            IdPagoConjunto: IdPagoConjunto,
            numeroBoleta: dataDB[i].NumeroBoleta,
            fechaCreacion: fechaCreacion,
        }
        arrayData.push(resObject)
    }

    const courses = await course.find().sort({ fechaInicioCurso: 'asc' });

    var nombreCursos = []

    for (let i = 0; i < courses.length; i++) {
        //console.log(courses[i])
        //console.log(courses[i].nombre)
        nombreCursos.push(courses[i].nombre)
    }

    res.render('pagos/showPayment', { arrayData, courses, nombreCursos })
}

// ? ------------------------------------------------------------------------ ? //
// ? -------- mostramos una lista con los datos para generar el pdf ? ------- ? //
// ? ------------------------------------------------------------------------ ? //
paymentControllers.readyToGeneratePDF = async (req, res) => {
    const pagosObject = req.params.objetosPagos

    var arraySuccesses = ""
    var arrayErrors = ""
    var courses = req.params.courses

    if (req.params.arrayErrors == '-') {
        arrayErrors = []
    } else {
        arraySuccesses = req.params.arrayErrors.split(",")
    }

    if (req.params.arraySuccesses == undefined) {
        arrayErrors = []
    } else {
        //console.log(req.params.arraySuccesses)
        arraySuccesses = req.params.arraySuccesses.split(",")
    }

    const datosHTML = req.params.objetoDatosHTML
    const transformData = datosHTML.replace(/['"]+/g, '"');
    const jsonDataHTML = JSON.parse(transformData)

    const jsonDataObjectPayment = JSON.parse(pagosObject)

    // #: datos del alumno
    var datosAlumno = await alumn.findById(jsonDataHTML.idAlumno)
    var DNI_alumno = datosAlumno.DNI

    var arrayData = []
    var nombreCurso = ""
    var IdPagoConjunto = ""

    for (let i = 0; i < jsonDataObjectPayment.length; i++) {
        var idMovimientoAlumno = jsonDataObjectPayment[i].idMovimientoAlumno
        var valorId_MovAlumn = idMovimientoAlumno[0]

        var movAlumnDB = await movAlumn.findById(valorId_MovAlumn)
        var dataCurso = await course.findById(movAlumnDB.idCurso)
        var dataAlumno = await alumn.findById(movAlumnDB.idAlumno)


        var nombreAlumno = dataAlumno.nombre
        var apellidoAlumno = dataAlumno.apellido

        var fecha = (new Date(jsonDataObjectPayment[i].fechaCreacion).toLocaleDateString())

        if (nombreCurso == "") { nombreCurso = dataCurso.nombre }

        if (jsonDataObjectPayment[i].IdPagoConjunto != "" && jsonDataObjectPayment[i].IdPagoConjunto != undefined) {
            IdPagoConjunto = jsonDataObjectPayment[i].IdPagoConjunto
        }

        arrayData.push({
            nombreAlumno: nombreAlumno,
            apellidoAlumno: apellidoAlumno,
            DNI: DNI_alumno,
            nombreCurso: nombreCurso,
            nombreMes: jsonDataHTML.nombreMes[i],
            numeroMes: jsonDataHTML.numeroMes[i],
            precioMes: jsonDataHTML.precioMes[i],
            pagoAlumno: jsonDataHTML.pagoAlumno[i],
            saldoMes: jsonDataHTML.saldoMes[i],
            deudaAnterior: jsonDataHTML.deuda[i],
            nombreMesSaldoFavor: jsonDataHTML.nombreMesSaldoFavor[i],
            saldoFavorOriginal: jsonDataHTML.saldoFavorOriginal[i],
            saldoFavorUsado: jsonDataHTML.saldoFavorUsado[i],
            idObjeto: jsonDataObjectPayment[i]._id,
            IdPagoConjunto: IdPagoConjunto,
            numeroBoleta: jsonDataObjectPayment[i].NumeroBoleta,
            fechaCreacion: fecha,
        })
    }

    res.render('pagos/readyToGeneratePDF', { arrayData, arraySuccesses, arrayErrors, courses })
}

// ? ------------------------------------------------------------------------ ? //
// ? -------------------- generamos el PDF de la factura ? ------------------ ? //
// ? ------------------------------------------------------------------------ ? //
paymentControllers.generatedPDF = async (req, res) => {
    const {
        nombreAlumno,
        apellidoAlumno,
        DNIAlumno,
        nombreCurso,
        nombreMes,
        numeroMes,
        precioMes,
        pagoAlumno,
        saldoMes,
        deudaAnterior,
        nombreMesSaldoFavor,
        saldoFavorOriginal,
        saldoFavorUsado,
        idObjeto,
        IdPagoConjunto,
        numeroBoleta,
        fechaCreacion,
    } = req.body

    //console.log(req.body)

    const doc = new PDF({ bufferedPage: true });
    const filename = `FacturaNº${numeroBoleta}_Evolution.pdf`

    const date = new Date()
    const fechaStr = date.toLocaleDateString()

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachement; filename=${filename}`,
    })
    doc.on('data', (data) => { stream.write(data) })
    doc.on('end', () => { stream.end() })

    // % ------------------------------------------------------------------------------------------- % //
    // % ····························· generamos el contenido del PDF % ······························ //
    // % ------------------------------------------------------------------------------------------- % //

    // ? ...................................... ? //
    // ? agregamos el que estara sobre la tabla ? //
    // ? ...................................... ? //
    doc.setDocumentHeader({ height: '28' }, () => {
        // # -------------------------------- # //
        // # ////// Numero de factura /////// # //
        // # -------------------------------- # //
        doc.font('Helvetica-Bold')
            .fontSize(15)
            .text(`FACTURA Nº ${numeroBoleta}`, 100, 105, {
                width: 420,
                height: 1000,
                align: 'center'
            })

        doc.moveTo(120, 125)
            .lineTo(doc.page.width - 120, 125)
            .stroke()

        // # -------------------------------- # //
        // # ////// nombre del alumno /////// # //
        // # -------------------------------- # //
        doc.fontSize(12)
        doc.font('Courier-BoldOblique').fillColor('green')
            .text(`A nombre de: `, 60, 150, {
                width: 420,
                align: 'left',
                continued: true
            })
            .fillColor('blue')
            .text(`${nombreAlumno} ${apellidoAlumno}`, {
                width: 420,
                align: 'left',
            })

        // # -------------------------------- # //
        // # ////// dni del alumno /////// # //
        // # -------------------------------- # //
        doc.fillColor('green')
            .text(`DNI: `, 60, 170, {
                width: 420,
                align: 'left',
                continued: true
            })
            .fillColor('blue')
            .text(`${DNIAlumno}`, {
                width: 420,
                align: 'left',
            })

        // # --------------------------------------- # //
        // # ////// ID de la boleta (objeto) /////// # //
        // # --------------------------------------- # //
        doc.fillColor('green')
            .text(`ID boleta: `, 60, 190, {
                width: 420,
                align: 'left',
                continued: true
            })
            .fillColor('blue')
            .text(`${idObjeto}`, {
                width: 420,
                align: 'left',
            })

        // # --------------------------------------- # //
        // # ////////// nombre del curso /////////// # //
        // # --------------------------------------- # //
        doc.fillColor('green')
            .text(`Curso: `, 400, 150, {
                width: 420,
                align: 'left',
                continued: true
            })
            .fillColor('blue')
            .text(`${nombreCurso}`, {
                width: 420,
                align: 'left',
            })

        // # --------------------------------------- # //
        // # /////// nombre del mes (cuota) //////// # //
        // # --------------------------------------- # //
        doc.fillColor('green')
            .text(`Cuota: `, 400, 170, {
                width: 420,
                align: 'left',
                continued: true
            })
            .fillColor('blue')
            .text(`${numeroMes} (${nombreMes})`, {
                width: 420,
                align: 'left',
            })

        // # ------------------------------------------- # //
        // # /////// fecha de emicion de boleta //////// # //
        // # ------------------------------------------- # //
        doc.font('Times-BoldItalic')
            .fontSize(13)
            .fillColor('black')
            .text(`Fecha Emicion: ${fechaStr}`, 370, 50)
    })

    // ? ...................................... ? //
    // ? agregamos los datos a la tabla del PDF ? //
    // ? le asignamos un color a la tabla del PDF ? //
    // ? ...................................... ? //
    var colores = []

    var importe = ""
    if (deudaAnterior > 0) {
        importe = `$${deudaAnterior} (deuda)`
        colores.push('#FFCCCC')
    } else {
        importe = `$${precioMes}`
        colores.push('#CCFFCC')
    }

    var saldoExtra = ""
    if (saldoFavorUsado > 0) {
        saldoExtra = `$${saldoFavorUsado} (${nombreMesSaldoFavor})`
    } else {
        saldoExtra = '0'
    }

    var saldo = saldoMes

    if (saldoMes > 0) {
        saldo = `+$${saldoMes}`
    }
    if (saldoMes < 0) {
        saldo = `-$${saldoMes}`
    }

    const data = [
        {
            concepto: `Cuota del Mes de ${nombreMes}, del Curso de ${nombreCurso}`,
            importe: importe,
            pago: `$${pagoAlumno}`,
            saldo: saldo,
            extra: saldoExtra,
            fechaPago: fechaCreacion,
        }
    ]

    // ? ......................................... ? //
    // ? creamos la tabla con el contenido del PDF ? //
    // ? ......................................... ? //
    doc.addTable([
        { key: 'concepto', label: 'Concepto', align: 'center' },
        { key: 'importe', label: 'Importe', align: 'center' },
        { key: 'pago', label: 'Pago', align: 'center' },
        { key: 'saldo', label: 'Saldo', align: 'center' },
        { key: 'extra', label: 'Saldo Extra', align: 'center' },
        { key: 'fechaPago', label: 'fecha del pago', align: 'center' },
    ], data, {
        border: { size: 0.1, color: '#cdcdcd' },
        width: "fill_body",
        striped: true,
        stripedColors: colores,
        cellsColor: "#000",
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center'
    })

    // # --------------------------------------- # //
    // # /////// mensaje de firma/sello //////// # //
    // # --------------------------------------- # //
    doc.setDocumentFooter({ height: '60' }, () => {
        doc.moveTo(doc.footer.x + 550, doc.footer.y + 70)
            //.dash(5, { space: 5 })
            .lineTo(doc.footer.x + 350, doc.footer.y + 70)
            .stroke()

        doc.fontSize(12)
            .text(`firma/sello`, doc.footer.x + 250, doc.footer.y + 73, {
                width: 420,
                align: 'center'
            })
    })

    doc.render();

    // # ---------------------------------------- # //
    // # /////// marca de agua de boleta //////// # //
    // # ---------------------------------------- # //
    doc.fillOpacity(0.2)
        .image('src/public/img/logo/evolutionNLM.jpg',
            (doc.page.width - 250) * 0.5,
            (doc.page.height - 380),
            { align: 'center', fit: [300, 300], lineBreak: false })
        .lineWidth(3)
        .fillAndStroke("red", "#900")

    doc.end();
}

// # ------------------------------------------------------------------------ //
// # ····················· URLs para mostrar datos ·························· //
// # ------------------------------------------------------------------------ //
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
        idMesSaldoFavor: "",
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

        if (requestData.length > 0) {
            var saldoFavor = requestData.at(-1).SaldoAcreedor
            var salodUsado = requestData.at(-1).saldoAcreedorUsado_Total
            var idMes = requestData.at(-1)._id

            response.idMesSaldoFavor = idMes
            response.nombreMes = nombreMes
            response.numeroMes = mes
            response.saldoFavor = saldoFavor
            response.idAlumno = idAlumno
            response.usaSaldoFavor = false
            response.valorUsoSaldoFavor = salodUsado
        }
    }
    res.json(response)
}

paymentControllers.loadAlumndata = async (req, res) => {
    var idAlumno = req.params.idAlumno
    var datosAlumno = await alumn.findById(idAlumno)
    res.json(datosAlumno)
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
















































function createObjectPayment(NumeroBoleta, idMovimientoAlumno, idValorCurso, debe, haber, deudor, acreedor, estado, comentario, fechaDB, IdPagoConjunto, saldoFavorUsado, IdMesUsoSaldoAcreedor, ultimFechUsoSaldoAcreedor) {
    //* guardamos en DB 
    /*     console.log("")
        console.log("")
        console.log(`NumeroBoleta : ${NumeroBoleta}`)
        console.log(`idCurso : ${idCurso}`)
        console.log(`idAlumno : ${idAlumno}`)
        console.log(`idValorCurso : ${idValorCurso}`)
        console.log(`debe : ${debe}`)
        console.log(`haber : ${haber}`)
        console.log(`deudor : ${deudor}`)
        console.log(`acreedor : ${acreedor}`)
        console.log(`estado : ${estado}`)
        console.log(`comentario : ${comentario}`)
        console.log(`fechaDB : ${fechaDB}`)
        console.log(`IdPagoConjunto : ${IdPagoConjunto}`)
        console.log(`saldoFavorUsado : ${saldoFavorUsado}`)
        console.log(`IdMesUsoSaldoAcreedor : ${IdMesUsoSaldoAcreedor}`)
        console.log(`ultimFechUsoSaldoAcreedor : ${ultimFechUsoSaldoAcreedor}`) */

    var dataJson = {
        NumeroBoleta: NumeroBoleta,
        idMovimientoAlumno: idMovimientoAlumno,
        idValorCurso: idValorCurso,
        Debe: debe,
        Haber: haber,
        SaldoDeudor: deudor,
        SaldoAcreedor: acreedor,
    }

    if (IdPagoConjunto != "") {
        dataJson.IdPagoConjunto = IdPagoConjunto
    }
    if (acreedor > 0) {
        dataJson.saldoAcreedorUsado_Total = 0
        dataJson.ultimFechUsoSaldoAcreedor = ultimFechUsoSaldoAcreedor
    }
    if (saldoFavorUsado > 0) {
        dataJson.IdMesUsoSaldoAcreedor = IdMesUsoSaldoAcreedor
        dataJson.saldoAcreedorUsado_PagoActual = saldoFavorUsado
    }
    dataJson.Estado = estado
    dataJson.Comentario = comentario
    dataJson.fechaCreacion = fechaDB

    var responseData = new movAcc(dataJson)

    return responseData
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