const alumnControllers = {};
const { json } = require('express');
const { parse } = require('url');
const alumn = require('../models/Alumnos')
const course = require('../models/Cursos')
// --------------------------------------------------------------- //
// ····················· ingresar alumno ························· //
// --------------------------------------------------------------- //
alumnControllers.renderaddAlumn = async (req, res) => {
    const dataCourseAA = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = [];
    if (dataCourseAA.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('/alumn/addAlumn', { errors })
    }
    res.render('alumnos/addAlumn', { dataCourseAA })
}

alumnControllers.saveAlumn = async (req, res) => {
    const { nombreAlumno, apellidoAlumno, dniAlumno, cursos } = req.body
    //console.log(req.body)
    if (!nombreAlumno || !apellidoAlumno || !dniAlumno) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        res.redirect('/alumn/addAlumn')
    } else {
        const datAlumn = await alumn.find({
            nombreAlumno: nombreAlumno,
            apellidoAlumno: apellidoAlumno,
            DNI: dniAlumno,
        })

        if (datAlumn.length > 0) {
            req.flash('error_msg', 'ya existe este alumno');
            res.redirect('/alumn/addAlumn')
        } else {
            const dataAlumn = new alumn({
                nombreAlumno: nombreAlumno,
                apellidoAlumno: apellidoAlumno,
                DNI: dniAlumno,
                cursos: cursos,
                fechaCreacion: new Date()
            })
            const saveAlumn = await dataAlumn.save()
            req.flash('success_msg', 'el alumno fue agregado correctamente');
            res.redirect('/alumn/addAlumn')
        }
    }
}

// --------------------------------------------------------------- //
// ················ render editar - eliminar ····················· //
// --------------------------------------------------------------- //

// --------------------------------------------------------------- //
// ······················· editar alumno ························· //
// --------------------------------------------------------------- //

// --------------------------------------------------------------- //
// ··················· dar de baja a alumno ······················ //
// --------------------------------------------------------------- //

// --------------------------------------------------------------- //
// ·················· dar de alta a alumno ······················· //
// --------------------------------------------------------------- //

// --------------------------------------------------------------- //
// ·················· ver todos los alumnos ······················ //
// --------------------------------------------------------------- //

module.exports = alumnControllers