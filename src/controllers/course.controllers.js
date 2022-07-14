const courseControllers = {};
const { json } = require('express');
const { parse } = require('url');
const course = require('../models/Cursos')

// --------------------------------------------------------------- //
// ····················· ingresar curso ·························· //
// --------------------------------------------------------------- //
courseControllers.renderaddCourse = (req, res) => {
    res.render('cursos/addCourse')
}

courseControllers.saveCourse = async (req, res) => {
    const data = (req.body)
    var { nombreCurso } = data
    const errors = [];

    /**/
    if (!nombreCurso) {
        errors.push({ text: 'Por favor escriba el nombre del curso' })
    }
    if (errors.length > 0) {

        res.render('cursos/addCourse', {
            errors,
            nombreCurso
        })
    } else {
        const newCourse = new course({ nombreCurso, fechaCreacion: new Date() })
        await newCourse.save()
        req.flash('success_msg', 'nombre del curso agregado correctamente');
        res.redirect('/course/addCourse')
    }
}

// --------------------------------------------------------------- //
// ················ render editar - eliminar ····················· //
// --------------------------------------------------------------- //
courseControllers.renderSelectAction = async (req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    res.render('cursos/selectActionCourse', { cursos })
}

// --------------------------------------------------------------- //
// ····················· editar curso ···························· //
// --------------------------------------------------------------- //
courseControllers.renderEditCourse = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)
    res.render('cursos/editCourse', { dataCurso })
}

courseControllers.saveEdirCourse = async (req, res) => {
    const id = req.params.id
    const { nombreCurso } = req.body
    /*
    console.log(req.body)
    res.send('ok')
    */ 
    await course.findByIdAndUpdate(id, {
        nombreCurso,
        fechaModificacion: new Date()
    })
    req.flash('success_msg', 'deuda editada correctamente');
    res.redirect('/course/selectAction')
}

// --------------------------------------------------------------- //
// ··················· dar de baja a curso ······················· //
// --------------------------------------------------------------- //
courseControllers.saveDelete = async (req, res) => {
    const id = req.params.id
    /* 
    console.log(req.body);
    console.log(id)
    */
    await course.findByIdAndUpdate(id, {
        fechaEliminacion: new Date()
    })
    req.flash('success_msg', 'deuda eliminada correctamente');
    res.redirect('/course/selectAction')
}

// --------------------------------------------------------------- //
// ·················· dar de alta a curso ························ //
// --------------------------------------------------------------- //
courseControllers.renderSelectUp = async (req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $ne: null }
    }).sort({ date: 'desc' });
    res.render('cursos/selectUpCourse', { cursos })
}
courseControllers.saveUpCourse = async (req, res) => {
    const id = req.params.id
    /*
    console.log(req.body);
    console.log(id)
    res.send('ok')
    */
    await course.findByIdAndUpdate(id, {
        fechaEliminacion: null
    })
    req.flash('success_msg', 'deuda eliminada correctamente');
    res.redirect('/course/selectUp')
}

// --------------------------------------------------------------- //
// ·················· ver todos los cursos ······················· //
// --------------------------------------------------------------- //
courseControllers.renderShowCourse = async (req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    /* 
    console.log(cursos)
    */
    res.render('cursos/showCourse', { cursos })
}

module.exports = courseControllers
