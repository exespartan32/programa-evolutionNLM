priceCourseControllers = {};
const course = require('../models/Cursos');
const priceCourse = require('../models/ValorMesCurso');

// --------------------------------------------------------------- //
// ················ ingresar precio del curso ···················· //
// --------------------------------------------------------------- //
// eleguir curos
priceCourseControllers.renderShowCourse = async (req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = []
    if (cursos.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    res.render('cursos/precioCursos/selectCourse', { cursos })
}

// agregar precio al mes
priceCourseControllers.renderPriceMonth = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)
    res.render('cursos/precioCursos/addPriceCourse', { dataCurso })
}

// guardar valor del mes del curso y actualizar data del curso
priceCourseControllers.savePriceMonth = async (req, res) => {
    const { mes, precioMes, nombreCurso } = req.body
    const errors = [];

    // comprobamos si se reciben campos vacios
    if (!mes || !precioMes) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        res.redirect('/course/selectCourse')
    }else{
        const costCourse = new priceCourse({
            mes: mes, precioMes: precioMes,
            nombreCurso: nombreCurso,
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
            const saveCourse = await costCourse.save()
            const idPC = saveCourse._id
            const PrecioMes = {}
            PrecioMes._id = idPC;

            const addMonthCourse = await course.update(
                { nombreCurso: nombreCurso }, { $push: { valorMesCurso: PrecioMes } },
            )
            req.flash('success_msg', 'precio agregado correctamente');
            res.redirect('/course/selectCourse')
        }
    }
}

// --------------------------------------------------------------- //
// ·········· render edit o delete precio delcourse ·············· //
// --------------------------------------------------------------- //
priceCourseControllers.renderSelectCourseAction = async (req, res) => {
    const courseAction = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = []
    if (courseAction.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    res.render('cursos/precioCursos/SelectCourse', { courseAction })
}

priceCourseControllers.renderSelectAction = async (req, res) => {
    const id = req.params.id
    const data = await course.findById(id)
    const nameCourse = data.nombreCurso

    const dataPC = await priceCourse.find({
        nombreCurso: nameCourse,
        fechaEliminacion: { $eq: null }
    })

    res.render('cursos/precioCursos/selectActionCourse', {
        dataPC,
    })
}

// --------------------------------------------------------------- //
// ··················· editar precio del curso ··················· //
// --------------------------------------------------------------- //
priceCourseControllers.renderEditPrice = async (req, res) => {
    const id = req.params.id
    const dataPrice = await priceCourse.findById(id);
    console.log(dataPrice)
    //res.send('respuesta de edit')
    res.render('cursos/precioCursos/editPriceCourse', { dataPrice })
}

priceCourseControllers.saveEditCourse = async (req, res) => {
    const id = req.params.id
    const { mes, precioMes, nombreCurso } = req.body

    const updatePC = await priceCourse.findByIdAndUpdate(id, {
        $set: {
            precioMes: precioMes,
            mes: mes
        }
    })

    if (!updatePC) {
        req.flash('error_msg', 'error no se pudo actualizar la tabla cursos')
        res.redirect('/course/selectCoursePriceAction')
    } else {
        req.flash('success_msg', 'precio del curso de' + nombreCurso + 'editado correctamente')
        res.redirect('/course/selectCoursePriceAction')
    }
}

// --------------------------------------------------------------- //
// ··················· dar de baja a precio ······················ //
// --------------------------------------------------------------- //
priceCourseControllers.deleteCourse = async (req, res) => {
    const id = req.params.id
    const deletePC = await priceCourse.findByIdAndUpdate(id, {
        fechaEliminacion: new Date()
    })

    if (!deletePC) {
        req.flash('error_msg', 'error no se pudo eliminar el curso')
        res.redirect('/course/selectCoursePriceAction')
    } else {
        req.flash('success_msg', 'precio del curso ha sido eliminado correctamente');
        res.redirect('/course/selectCoursePriceAction')
    }
}

// --------------------------------------------------------------- //
// ··················· dar de alta a precio ······················ //
// --------------------------------------------------------------- //
priceCourseControllers.selectPriceCourseUp = async (req, res) => {
    const selectCoursePCUp = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = []
    if (selectCoursePCUp.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    console.log(selectCoursePCUp)
    res.render('cursos/precioCursos/selectCourse', { selectCoursePCUp })
}

priceCourseControllers.renderAltCourse = async (req, res) => {
    const id = req.params.id
    const data = await course.findById(id)
    const nameCourse = data.nombreCurso

    const dataPC = await priceCourse.find({
        nombreCurso: nameCourse,
        fechaEliminacion: { $ne: null }
    })
    const errors = []
    if (dataPC.length == 0) {
        errors.push({ text: 'no hay cursos borrados que mostrar' })
        res.render('cursos/precioCursos/SelectUpPriceCourse', { errors })
    } else {
        res.render('cursos/precioCursos/SelectUpPriceCourse', { dataPC })
    }
}

priceCourseControllers.saveUpPriceMonth = async (req, res) => {
    const id = req.params.id
    //console.log(id)
    //res.send('ok')
    const dataUpPC = await priceCourse.findByIdAndUpdate(id, {
        fechaEliminacion: null
    })

    req.flash('success_msg', 'precio del curso ha sido restaurado correctamente');
    res.redirect('/course/selectPriceCourseUp')
}


module.exports = priceCourseControllers;