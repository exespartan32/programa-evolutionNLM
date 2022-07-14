priceCourseControllers = {};
const course = require('../models/Cursos');
const precioMes = require('../models/ValorMesCurso');

// --------------------------------------------------------------- //
// ················ ingresar precio del curso ···················· //
// --------------------------------------------------------------- //
priceCourseControllers.renderShowCourse = async(req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $ne: null }
    }).sort({ date: 'desc' });
    const errors = []
    if (cursos.length == 0){
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    res.render('cursos/precioCursos/selectCourse', { cursos })
}

module.exports = priceCourseControllers;