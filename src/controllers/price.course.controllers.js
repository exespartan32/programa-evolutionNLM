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
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    res.render('cursos/precioCursos/selectCourse', { cursos })
}

// ---------------- 2) agregar precio al mes --------------------- //
priceCourseControllers.renderPriceMonth = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)
    res.render('cursos/precioCursos/addPriceCourse', { dataCurso, })
}

// ------------- 3) guardar valor del mes del curso ------------- //
priceCourseControllers.savePriceMonth = async (req, res) => {
    const idCourse = req.params.id
    const { mes, precioMes } = req.body
    const errors = [];
    // comprobamos si se reciben campos vacios
    if (!mes || !precioMes) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        res.redirect('/course/selectCourse')
    } else {
        const costCourse = new priceCourse({
            mes: mes,
            precioMes: precioMes,
            idCurso: idCourse,
            fechaCreacion: new Date()
        })
        // comprobamos que no exista el valor de ese mes en la DB
        const courseAction = await priceCourse.find({
            mes: { $eq: mes }
        })
        // si existe en la DB redireccionamos a /course/selectCourse
        if (courseAction.length > 0) {
            req.flash('error_msg', 'el mes seleccionado ya tiene precio');
            res.redirect('/course/selectCourse')
            // si no existe en la DB lo gurdamos en la tabla valorCurso y Curso
        } else {
            await costCourse.save()
            req.flash('success_msg', 'precio agregado correctamente');
            res.redirect('/course/selectCourse')
        }
    }
}

// --------------------------------------------------------------- //
// ·················· ver todos los precios ······················ // 
// ······················ editar precios ························· // 
// --------------------------------------------------------------- //
priceCourseControllers.renderSelectCourseViewPrice = async (req, res) => {
    const viewPC = await await course.find().sort({ fechaInicioCurso: 'asc' });
    const errors = []
    if (viewPC.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    res.render('cursos/precioCursos/selectCourse', { viewPC })
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
    console.log(precioMes)

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

module.exports = priceCourseControllers;