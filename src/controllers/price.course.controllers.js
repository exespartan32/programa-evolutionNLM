priceCourseControllers = {};
const course = require('../models/Cursos');
const valorCourse = require('../models/ValorMesCurso');

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
    if (!mes || !precioMes) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        errors.push("")
    }
    if (errors.length > 0) {
        res.redirect('/course/selectCourse')
    } else {
        const valorCurso = new valorCourse({ mes: mes, precioMes: precioMes, nombreCurso: nombreCurso, fechaCreacion: new Date() })
        await valorCurso.save()

        const dataCourse = await valorCourse.find({
            nombreCurso: nombreCurso
        })

        const updateCourse = await course.update({
            nombreCurso: nombreCurso,
            valorMesCurso: dataCourse
        })

        req.flash('success_msg', 'precio agregado correctamente');
        res.redirect('/course/selectCourse')
    }
}

// --------------------------------------------------------------- //
// ················ render edit o delete course ·················· //
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

    const data = await course.findById(id);
    const priceCourse = data.valorMesCurso;
    const nameCourse = data.nombreCurso;
    //console.log(nameCourse);

    res.render('cursos/precioCursos/selectActionCourse', { priceCourse, nameCourse })
    //res.send('ok')
}

// --------------------------------------------------------------- //
// ··················· editar precio del curso ··················· //
// --------------------------------------------------------------- //
priceCourseControllers.renderEditPrice = async (req, res) => {
    const id = req.params.id
    const dataPrice = await valorCourse.findById(id);
    res.render('cursos/precioCursos/editPriceCourse', { dataPrice })
}

priceCourseControllers.saveEditCourse = async (req, res) => {
    const id = req.params.id
    const { mes, precioMes, nombreCurso } = req.body
    /* 
    await valorCourse.findByIdAndUpdate(id, {
        mes,
        precioMes,
        fechaModificacion: new Date()
    })
    const dataPriceCourse = await valorCourse.findById(id);
   

    const data = course.update({ 'valorMesCurso._id': id }, {
        '$set': {
            'valorMesCurso.$.fechaModificacion': new Date(),
            'valorMesCurso.$.precioMes': precioMes,
            'valorMesCurso.$.mes': mes
        }
    })
    

    const data = await course.updateOne(
        { nombreCurso: nombreCurso, "valorMesCurso._id": {$eq : id } },
        {
            $set: {
                "valorMesCurso.$.fechaModificacion": new Date(),
                "valorMesCurso.$.mes": mes,
                "valorMesCurso.$.precioMes": precioMes,
            }
        }
    )
    */
    console.log(data1)
    res.send('ok')


    //req.flash('success_msg', 'precio del curso de' + nombreCurso + 'editado correctamente');
    //res.redirect('/course/selectCoursePriceAction')
}

priceCourseControllers.deleteCourse = async (req, res) => { }



module.exports = priceCourseControllers;