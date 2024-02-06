priceCourseControllers = {};
const course = require('../models/curso');
const priceCourse = require('../models/valorCurso');

// --------------------------------------------------------------- //
// ················ ingresar precio del curso ···················· //
// --------------------------------------------------------------- //
// -------------------- 1) eleguir curso ------------------------- //
priceCourseControllers.renderShowCourse = async (req, res) => {
    const cursos = await course.find().sort({ fechaInicioCurso: 'asc' });
    const errors = []
    if (cursos.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourseAdd', { errors })
    }
    res.render('cursos/precioCursos/selectCourseAdd', { cursos })
}

// ---------------- 2) agregar precio al mes --------------------- //
priceCourseControllers.renderPriceMonth = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)
    const dataValCourse = await priceCourse.find({ idCurso: id })

    var dataMes = {
        nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        numeroAño: ['2023', '2024']
    }

    var datosMeses = {
        numeroMeses: [],
        nombreMeses: [],
        precioMeses: []
    }

    if (dataValCourse.length > 0) {
        for (let i = 0; i < dataValCourse.length; i++) {
            const month = (dataValCourse[i].mes.split("-"))[1]
            datosMeses.numeroMeses.push(dataValCourse[i].mes)

            for (let j = 0; j < dataMes.numeroMes.length; j++) {
                if (month == dataMes.numeroMes[j]) {
                    datosMeses.nombreMeses.push(dataMes.nombreMes[j])
                    datosMeses.precioMeses.push(dataValCourse[i].precioMes)
                }
            }
        }
    }

    res.render('cursos/precioCursos/addPriceCourse', { dataCurso, datosMeses })
}

// ------------- 3) guardar valor del mes del curso ------------- //
priceCourseControllers.savePriceMonth = async (req, res) => {
    const idCourse = req.params.id
    const { mes, precioMes } = req.body

    var dataMes = {
        nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        numeroAño: ['2023', '2024']
    }

    var nombreMes
    for (let i = 0; i < dataMes.numeroMes.length; i++) {
        if (dataMes.numeroMes[i] == mes.split('-')[1]) { nombreMes = dataMes.nombreMes[i] }
    }

    var ObjectPriceCourse = new priceCourse({
        mes: mes,
        precioMes: precioMes,
        idCurso: idCourse,
        fechaCreacion: setDate()
    })

    var savedata = await ObjectPriceCourse.save()
    if (savedata.length == 0) {
        req.flash('error_msg', `error al tratar de guardar el precio del mes de ${nombreMes}`);
    } else {
        req.flash('success_msg', `el precio del mes de ${nombreMes} se guardo correctamente`);
    }
    res.redirect('/course/selectCourse')
}

// --------------------------------------------------------------- //
// ·················· ver todos los precios ······················ // 
// ······················ editar precios ························· // 
// --------------------------------------------------------------- //
priceCourseControllers.renderSelectCourseViewPrice = async (req, res) => {
    const listaCursosVerPrecios = await await course.find().sort({ fechaInicioCurso: 'asc' });
    const errors = []

    if (listaCursosVerPrecios.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourseShow', { errors })
    }

    res.render('cursos/precioCursos/selectCourseShow', { listaCursosVerPrecios })
}

priceCourseControllers.ViewPriceCourse = async (req, res) => {
    const idCourse = req.params.id
    const dataPriceCourse = await priceCourse.find({
        idCurso: { $eq: idCourse },
    })
    const dataCourse = await course.findById(idCourse)
    res.render('cursos/precioCursos/showPriceCourse', { dataPriceCourse, dataCourse })
}

// --------------------------------------------------------------- //
// ····················· editar precio ··························· //
// --------------------------------------------------------------- //
priceCourseControllers.renderEditPrice = async (req, res) => {
    const id = req.params.id
    const dataPrice = await priceCourse.findById(id);
    const idCourse = dataPrice.idCurso
    const dataCourse = await course.findById(idCourse)
    res.render('cursos/precioCursos/editPriceCourse', { dataPrice, dataCourse })
}

priceCourseControllers.saveEditCourse = async (req, res) => {
    const id = req.params.id
    const { precioMes } = req.body

    const updatePC = await priceCourse.findByIdAndUpdate(id, {
        $set: {
            precioMes: precioMes,
            fechaModificacion: new Date()
        }
    })
    if (!updatePC) {
        req.flash('error_msg', 'error al actualizar la base de datos')
        res.redirect('/course/selectViewPC/')
    } else {
        req.flash('success_msg', 'precio modificado correctamente')
        res.redirect('/course/selectViewPC/')
    }
}

function setDate() {
    //* Seteamos el Date para que se guarde correctamente en DB
    var date = new Date()
    const dateParse = new priceCourse({
        fechaCreacion: date,
        offset: date.getTimezoneOffset()
    })
    return new Date(dateParse.fechaCreacion.getTime() - (dateParse.offset * 60000));
}

module.exports = priceCourseControllers;