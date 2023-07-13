const alumnControllers = {};
const { json } = require('express');
const { parse } = require('url');
const alumn = require('../models/alumno')
const course = require('../models/curso')
const movAlumn = require('../models/movimientoDeAlumno')
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
    //res.send('ok')
}

alumnControllers.saveAlumn = async (req, res) => {
    const { nombreAlumno, apellidoAlumno, dniAlumno, cursos } = req.body
    //console.log(req.body)
    //res.send('ok')

    if (!nombreAlumno || !apellidoAlumno || !dniAlumno) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        res.redirect('/alumn/addAlumn')
    } else {
        const datAlumn = await alumn.find({
            nombre: nombreAlumno,
            apellido: apellidoAlumno,
            DNI: dniAlumno,
        })

        if (datAlumn.length > 0) {
            req.flash('error_msg', 'ya existe este alumno');
            res.redirect('/alumn/addAlumn')
        } else {
            const dataAlumn = new alumn({
                nombre: nombreAlumno,
                apellido: apellidoAlumno,
                DNI: dniAlumno,
                cursos: cursos,
                fechaCreacion: new Date()
            })
            const saveAlumn = await dataAlumn.save()
            const idAlumno = saveAlumn._id
            const dataCourse = await course.find({
                nombre: { $eq: cursos }
            })
            const idCurso = dataCourse[0]._id
            const saveMovAlumn = new movAlumn({
                idCurso: idCurso,
                idAlumno: idAlumno,
                fechaCreacion: new Date()

            })
            await saveMovAlumn.save()

            req.flash('success_msg', 'el alumno fue agregado correctamente');
            res.redirect('/alumn/addAlumn')
        }
    } /**/
}

// --------------------------------------------------------------- //
// ················ render editar - eliminar ····················· //
// --------------------------------------------------------------- //
alumnControllers.renderAlumn = async (req, res) => {
    const dataMovAlumn = await movAlumn.find()

    const dataAlumn = []

    for (var item in dataMovAlumn) {
        const idCourse = dataMovAlumn[item].idCurso
        const idAlumn = dataMovAlumn[item].idAlumno

        const courseDt = await course.findById(idCourse)
        const alumnDt = await alumn.findById(idAlumn)

        const detailsAlumn = {}

        detailsAlumn.nombreCurso = courseDt.nombre
        detailsAlumn.nombreAlumno = alumnDt.nombre
        detailsAlumn.apellidoAlumno = alumnDt.apellido
        detailsAlumn.dniAlumno = alumnDt.DNI

        dataAlumn.push(detailsAlumn)
    }
    //console.log(dataAlumn)
    res.render('alumnos/showAllAlumn', { dataAlumn })
}
// --------------------------------------------------------------- //
// ······················· editar alumno ························· //
// --------------------------------------------------------------- //
alumnControllers.renderEditAlumn = async (req, res) => {
    // buscamos los datos del alumno
    const IdMovAlumn = req.params.id
    const dataMovAlumn = await movAlumn.findById(IdMovAlumn)

    const dataAlumn = await alumn.findById(dataMovAlumn.idAlumno)
    const dataCourse = await course.findById(dataMovAlumn.idCurso)

    // buscamos los cursos
    const courses = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = [];
    if (courses.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('alumnos/editAlumn', { errors })
    }

    const variables = {
        'dataAlumn': dataAlumn,
        'dataCourse': dataCourse,
        'courses': courses,
    }
    //res.render('alumnos/editAlumn', { dataAlumn, dataCourse, courses })
    res.render('alumnos/editAlumn', { variables })
}

// --------------------------------------------------------------- //
// ··················· dar de baja a alumno ······················ //
// --------------------------------------------------------------- //

// --------------------------------------------------------------- //
// ·················· dar de alta a alumno ······················· //
// --------------------------------------------------------------- //

// --------------------------------------------------------------- //
// ····················· ver los alumnos ························· //
// --------------------------------------------------------------- //
alumnControllers.renderSelectCourse = async (req, res) => {
    const courses = await await course.find().sort({ fechaInicioCurso: 'asc' });
    const errors = []
    if (courses.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    res.render('alumnos/selectCourseShowAlumn', { courses })
}

alumnControllers.renderShowAlumn = async (req, res) => {
    const idCourse = req.params.id
    const dataCourse = await course.findById(idCourse)
    const dataMovAlumn = await movAlumn.find({
        idCurso: { $eq: idCourse },
    })
    const courseMembers = []
    for (var item in dataMovAlumn) {
        const idAlumn = dataMovAlumn[item].idAlumno
        const idCorse = dataMovAlumn[item].idCurso
        const dataAlumnCourse = await alumn.findById(idAlumn)
        //console.log(dataAlumnCourse)

        const data = {}
        data.dataAlumnCourse = dataAlumnCourse
        data.IdMovAlumn = dataMovAlumn[item]._id
        courseMembers.push(data)
    }
    //console.log(courseMembers)
    //res.send("ok")
    res.render('alumnos/showAlumn', { courseMembers, dataCourse })
}

module.exports = alumnControllers