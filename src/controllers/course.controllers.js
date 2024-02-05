const courseControllers = {};
const { json } = require('express');
const { parse } = require('url');
const course = require('../models/curso')

// --------------------------------------------------------------- //
// ····················· ingresar curso ·························· //
// --------------------------------------------------------------- //
courseControllers.renderaddCourse = (req, res) => {
    res.render('cursos/addCourse')
}

courseControllers.saveCourse = async (req, res) => {
    var { nombre, duracion, fechaInicioCurso, fechaFinCurso } = req.body

    var nombreMin = nombre.toLowerCase()

    if (!nombre || !duracion || !fechaInicioCurso || !fechaFinCurso) {
        req.flash('error_msg', 'no debe haber campos vacios');
        res.redirect('/course/addCourse')
    } else {
        const dataDB = await course.find({
            nombre: { $eq: nombreMin }
        })
        //console.log(dataDB)
        if (dataDB.length > 0) {
            req.flash('error_msg', 'ya existe un curso con el mismo nombre');
            res.redirect('/course/addCourse')
        } else {
            const newCourse = new course({
                nombre: nombreMin,
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
// ·················· ver todos los cursos ······················· //
// --------------------------------------------------------------- //
courseControllers.renderShowCourse = async (req, res) => {
    const cursos = await course.find().sort({ fechaInicioCurso: 'asc' });
    const errors = [];
    if (cursos.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/showCourse', { errors })
    }

    res.render('cursos/showCourse', { cursos })
}

// --------------------------------------------------------------- //
// ····················· editar curso ···························· //
// --------------------------------------------------------------- //
courseControllers.renderEditCourse = async (req, res) => {
    const id = req.params.id
    const dataCurso = await course.findById(id)
    const strDataCurso = JSON.stringify(dataCurso)
    //console.log(dataCurso)
    res.render('cursos/editCourse', { dataCurso, strDataCurso })
}

courseControllers.saveEdirCourse = async (req, res) => {
    const id = req.params.id
    const { nombre, duracion, fechaInicioCurso, fechaFinCurso } = req.body
    var nombreMin = nombre.toLowerCase()
    //res.send(req.body)

    const response = await course.findByIdAndUpdate(id, {
        nombre: nombreMin,
        duracion,
        fechaInicioCurso,
        fechaFinCurso,
        fechaModificacion: new Date()
    })

    if (response) {
        req.flash('success_msg', 'datos editados correctamente');
        res.redirect('/course/showCourse')
    } else {
        req.flash('error_msg', 'ha ocurrido un error al tartar de editar los datos en base de datos');
        res.redirect('/course/showCourse')
    }

}


// # ------------------------------------------------------------------------ //
// # ······················ URLs para buscar datos ·························· //
// # ------------------------------------------------------------------------ //
courseControllers.searchCourse = async (req, res) => {
    const { nombreCurso } = req.params

    const datCourse = await course.findOne({
        nombre: nombreCurso,
    })
    console.log(datCourse)

    res.json(datCourse)
}

module.exports = courseControllers
