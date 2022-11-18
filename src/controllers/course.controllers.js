const courseControllers = {};
const { json } = require('express');
const { parse } = require('url');
const course = require('../models/curso')
const moment = require('moment-timezone');

// --------------------------------------------------------------- //
// ····················· ingresar curso ·························· //
// --------------------------------------------------------------- //
courseControllers.renderaddCourse = (req, res) => {
    res.render('cursos/addCourse')
}

courseControllers.saveCourse = async (req, res) => {
    //const data = (req.body)
    var { nombre, duracion, fechaInicioCurso, fechaFinCurso } = req.body

    if (!nombre || !duracion || !fechaInicioCurso || !fechaFinCurso) {
        req.flash('error_msg', 'no debe haber campos vacios');
        res.redirect('/course/addCourse')
    } else {
        const dataDB = await course.find({
            nombre: { $eq: nombre }
        })
        //console.log(dataDB)
        if (dataDB.length > 0) {
            req.flash('error_msg', 'ya existe un curso con el mismo nombre');
            res.redirect('/course/addCourse')
        } else {
            const newCourse = new course({
                nombre,
                duracion: duracion,
                fechaInicioCurso,
                fechaFinCurso,
                fechaCreacion: new Date(),
            })
            const resDB = await newCourse.save()

            if (resDB) {
                req.flash('success_msg', 'curso agregado correctamente');
                res.redirect('/course/addCourse')
            } else {
                req.flash('error_msg', 'ha ocurrido un error al guardar en base de datos');
                res.redirect('/course/addCourse')
            }
        }
    }
}

// --------------------------------------------------------------- //
// ················ render editar - eliminar ····················· //
// --------------------------------------------------------------- //
courseControllers.renderSelectAction = async (req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = [];
    if (cursos.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/selectActionCourse', { errors })
    }
    console.log(cursos)
    res.render('cursos/selectActionCourse', { cursos })
}

// --------------------------------------------------------------- //
// ····················· editar curso ···························· //
// --------------------------------------------------------------- //
courseControllers.renderEditCourse = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)

    res.render('cursos/editCourse', { dataCurso, })
}

courseControllers.saveEdirCourse = async (req, res) => {
    const id = req.params.id
    const { nombre, duracion, fechaInicioCurso, fechaFinCurso } = req.body

    await course.findByIdAndUpdate(id, {
        nombre,
        duracion,
        fechaInicioCurso,
        fechaFinCurso,
        fechaModificacion: new Date()
    })
    req.flash('success_msg', 'deuda editada correctamente');
    res.redirect('/course/selectAction')
    /*     const dataDB = await course.find({
            nombre: { $eq: nombre }
        })
        if (dataDB.length > 0) {
            req.flash('error_msg', 'ya existe un curso con el mismo nombre');
            res.redirect('/course/selectAction')
        } else {
            await course.findByIdAndUpdate(id, {
                nombre,
                fechaModificacion: new Date()
            })
            req.flash('success_msg', 'deuda editada correctamente');
            res.redirect('/course/selectAction')
        } */
}

// --------------------------------------------------------------- //
// ··················· dar de baja a curso ······················· //
// --------------------------------------------------------------- //
courseControllers.saveDelete = async (req, res) => {
    const id = req.params.id
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
    const errors = [];
    if (cursos.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/selectUpCourse', { errors })
    }
    res.render('cursos/selectUpCourse', { cursos })
}
courseControllers.saveUpCourse = async (req, res) => {
    const id = req.params.id
    await course.findByIdAndUpdate(id, {
        fechaEliminacion: null
    })
    req.flash('success_msg', 'deuda restaurada correctamente');
    res.redirect('/course/selectUp')
}

// --------------------------------------------------------------- //
// ·················· ver todos los cursos ······················· //
// --------------------------------------------------------------- //
courseControllers.renderShowCourse = async (req, res) => {
    const cursos = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = [];
    if (cursos.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/showCourse', { errors })
    }

    res.render('cursos/showCourse', { cursos })
}

module.exports = courseControllers
