priceCourseControllers = {};
const course = require('../models/Cursos');
const valorCourse = require('../models/ValorMesCurso');

// --------------------------------------------------------------- //
// ················ ingresar precio del curso ···················· //
// --------------------------------------------------------------- //
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

priceCourseControllers.renderPriceMonth = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)
    res.render('cursos/precioCursos/addPriceCourse', { dataCurso })
}

priceCourseControllers.savePriceMonth = async (req, res) => {
    const { mes, precioMes, nombreCurso } = req.body
    
     
    const errors = [];
    if (!mes || !precioMes){
        req.flash('error_msg', 'no deven de haber campos vacios');
        errors.push( "" )
    }
    if (errors.length > 0) {
        res.redirect('/course/selectCourse')
    } else {
        const valorCurso = new valorCourse({mes:mes, precioMes:precioMes, nombreCurso:nombreCurso, fechaCreacion: new Date()})
        await valorCurso.save()
        req.flash('success_msg', 'precio agregado correctamente');
        res.redirect('/course/selectCourse')

        const dataCurso = await course.find({
            nombreCurso: nombreCurso
        })
        console.log(dataCurso)
    }
    /**/

}

module.exports = priceCourseControllers;