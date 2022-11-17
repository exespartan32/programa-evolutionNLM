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

    const dateArginit = moment.tz(fechaInicioCurso, 'America/Argentina/Mendoza')
    const dateArgEnd = moment.tz(fechaFinCurso, 'America/Argentina/Mendoza')
    const dateArgCreation = moment.tz(Date(), "America/Argentina/Mendoza");

    console.log(dateArgCreation)


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
                fechaInicioCurso: dateArginit,
                fechaFinCurso: dateArgEnd,
                fechaCreacion: new Date(),
            })
            console.log(newCourse)
            const resDB = await newCourse.save()

            if (resDB.length > 0) {
                req.flash('success_msg', 'nombre del curso agregado correctamente');
                res.redirect('/course/addCourse')
            }else{
                req.flash('error_msg', 'ha ocurrido un error al guardar en base de datos');
                res.redirect('/course/addCourse')
            }
        }
    }


    /* 
        if (!nombre) {
            errors.push({ text: 'Por favor escriba el nombre del curso' })
        }
        if (errors.length > 0) {
            res.render('cursos/addCourse', {
                errors,
                nombre
            })
        } else {
            const data = await course.find({
                nombre: { $eq: nombre }
            })
            console.log(data)
            if (data.length > 0) {
                req.flash('error_msg', 'ya existe un curso con el mismo nombre');
                res.redirect('/course/addCourse')
            } else {
                const newCourse = new course({ 
                    nombre, 
                    fechaCreacion: new Date(),
                    duracion: duracion
                })
                await newCourse.save()
                req.flash('success_msg', 'nombre del curso agregado correctamente');
                res.redirect('/course/addCourse')
            }
        } */
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
    res.render('cursos/editCourse', { dataCurso })
}

courseControllers.saveEdirCourse = async (req, res) => {
    const id = req.params.id
    const { nombre } = req.body
    /*
    console.log(req.body)
    res.send('ok')
    */

    const dataDB = await course.find({
        nombre: { $eq: nombre }
    })

    /*     console.log(dataDB)
        res.send('respuesta de edit') */

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
    }
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
    /* 
    console.log(cursos)
    */
    res.render('cursos/showCourse', { cursos })
}

module.exports = courseControllers
