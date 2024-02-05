const alumnControllers = {};
const { json } = require('express');
const { parse } = require('url');
const alumn = require('../models/alumno')
const course = require('../models/curso')
const movAlumn = require('../models/movimientoDeAlumno')

// % --------------------------------------------------------------- % //
// % ····················· ingresar alumno ························· % //
// % --------------------------------------------------------------- % //
alumnControllers.renderaddAlumn = async (req, res) => {
    const dataCourses = await course.find().sort({ date: 'desc' });
    const errors = [];
    if (dataCourses.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('alumnos/addAlumn', { errors })
    }else{
        res.render('alumnos/addAlumn', { dataCourses })
    }
}

// % --------------------------------------------------------------- % //
// % ·················· guardar datos de alumno ···················· % //
// % --------------------------------------------------------------- % //
alumnControllers.saveAlumn = async (req, res) => {
    const { nombreAlumno, apellidoAlumno, dniAlumno, nombreCurso } = req.body
    //res.send(req.body)
    const nombreAlumnoMinus = nombreAlumno.toLowerCase()
    const ApellidoAlumnoMinus = apellidoAlumno.toLowerCase()
    const dataCurso = await course.findOne({ nombre: nombreCurso })
    const idCurso = dataCurso._id

    //console.log(`nombre en minsucula: ${nombreAlumnoMinus}`)
    //console.log(`apellido en minsucula: ${ApellidoAlumnoMinus}`)
    //console.log(`DNI del alumno: ${dniAlumno}`)
    //console.log(`id del curso: ${idCurso}`)
    //console.log(`fecha y hora actual:  ${setDate()}`)
    //console.log(`nombre del curso:  ${nombreCurso}`)

    // ? : ------------------------------------------ ? : //
    // ? : guardamos el alumno en la tabla de alumnos ? : //
    // ? : ------------------------------------------ ? : //
    const newAlumnDB = new alumn({
        nombre: nombreAlumnoMinus,
        apellido: ApellidoAlumnoMinus,
        DNI: dniAlumno,
        fechaCreacion: setDate(),
    })
    const saveAlumn = newAlumnDB.save()

    // ? : -------------------------------------------------------------- ? : //
    // ? : guardamos el alumno juno con el curso que realizara el alumno  ? : //
    // ? : -------------------------------------------------------------- ? : //
    const newMovAlumnDB = new movAlumn({
        idCurso: idCurso,
        idAlumno: newAlumnDB._id,
        fechaCreacion: setDate(),
    })
    const saveMovAlumn = newMovAlumnDB.save()

    // ? : --------------------------------------------------------- ? : //
    // ? : mostramos un mensaje si se guardo el alumno correctanete  ? : //
    // ? : si no se guardo el alumno mostramos un mensaje de error   ? : //
    // ? : --------------------------------------------------------- ? : //
    if (saveAlumn && saveMovAlumn) {
        req.flash('success_msg', 'alumno agregado correctamente');
        res.redirect('/alumn/addAlumn/')
    } else {
        req.flash('error_msg', 'ha ocurrido un error al tratar de guardar el alumno');
        res.redirect('/alumn/addAlumn/')
    }
}

// % --------------------------------------------------------------- % //
// % ················ ver todos los alumnos / editar ··············· % //
// % --------------------------------------------------------------- % //
alumnControllers.renderAllAlumn = async (req, res) => {
    const dataMovAlumn = await movAlumn.find()

    const dataAlumn = []

    for (var item in dataMovAlumn) {
        const idCourse = dataMovAlumn[item].idCurso
        const idAlumn = dataMovAlumn[item].idAlumno

        const courseDt = await course.findById(idCourse)
        const alumnDt = await alumn.findById(idAlumn)

        const detailsAlumn = {}

        detailsAlumn.nombreCurso = courseDt.nombre
        detailsAlumn.IdMovAlumn = dataMovAlumn[item]._id
        detailsAlumn.idCurso = courseDt._id
        detailsAlumn.idAlumno = alumnDt._id
        detailsAlumn.nombreAlumno = alumnDt.nombre
        detailsAlumn.apellidoAlumno = alumnDt.apellido
        detailsAlumn.dniAlumno = alumnDt.DNI

        dataAlumn.push(detailsAlumn)
    }
    //console.log(dataAlumn)
    res.render('alumnos/showAllAlumn', { dataAlumn })
}


// % --------------------------------------------------------------- % //
// % ······················· editar alumno ························· % //
// % --------------------------------------------------------------- % //
alumnControllers.renderEditAlumn = async (req, res) => {
    const formularioAction = req.body.formularioAction
    // buscamos los datos del alumno
    const IdMovAlumn = req.params.id
    const dataMovAlumn = await movAlumn.findById(IdMovAlumn)

    const dataAlumn = await alumn.findById(dataMovAlumn.idAlumno)
    const cursoActualAlumno = await course.findById(dataMovAlumn.idCurso)

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
        dataAlumn: dataAlumn,
        dataAlumnStr: JSON.stringify(dataAlumn),
        cursoActualAlumno: cursoActualAlumno,
        courses: courses,
        formularioAction: formularioAction,
    }

    for (let i = 0; i < variables.courses.length; i++) {
        var cursoIString = JSON.stringify(variables.courses[i])
        var cursoActualString = JSON.stringify(cursoActualAlumno)

        if (cursoIString == cursoActualString) {
            variables.courses.splice(i, 1)
        }
    }

    //res.render('alumnos/editAlumn', { dataAlumn, dataCourse, courses })
    res.render('alumnos/editAlumn', { variables })
}

// % --------------------------------------------------------------- % //
// % ··········· guardar edicion de los datos del alumno ··········· % //
// % --------------------------------------------------------------- % //
alumnControllers.saveEditAlumn = async (req, res) => {
    const idAlumno = req.params.id
    const { nombreAlumno, apellidoAlumno, dniAlumno, cursos } = req.body

    //res.send(req.body)

    const nombreAlumnoMinus = nombreAlumno.toLowerCase()
    const ApellidoAlumnoMinus = apellidoAlumno.toLowerCase()

    // ? : --------------------------------------------------------- ? : //
    // ? : ------------- editamos los datos el alumno  ------------- ? : //
    // ? : --------------------------------------------------------- ? : //
    const editAlumnDB = await alumn.findByIdAndUpdate(idAlumno, {
        nombre: nombreAlumnoMinus,
        apellido: ApellidoAlumnoMinus,
        DNI: dniAlumno,
        fechaModificacion: setDate(),
    })

    const editMovAlumn = await movAlumn.findOneAndUpdate({ idAlumno: idAlumno }, {
        idCurso: cursos,
        fechaModificacion: setDate(),
    })

    if (editAlumnDB && editMovAlumn) {
        req.flash('success_msg', 'alumno editado correctamente');
        res.redirect('/alumn/selectCourseShowAlumn')
    } else {
        req.flash('error_msg', 'ha ocurrido un error al tratar de editar el alumno');
        res.redirect('/alumn/selectCourseShowAlumn')
    }

}

// % --------------------------------------------------------------- % //
// % ····················· ver los alumnos ························· % //
// % --------------------------------------------------------------- % //
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

// # ------------------------------------------------------------------------ //
// # ···························· funciones  ································ //
// # ------------------------------------------------------------------------ //
function setDate() {
    //* Seteamos el Date para que se guarde correctamente en DB
    var date = new Date()
    const dateParse = new alumn({
        fechaCreacion: date,
        offset: date.getTimezoneOffset()
    })
    return new Date(dateParse.fechaCreacion.getTime() - (dateParse.offset * 60000));
}

// # ------------------------------------------------------------------------ //
// # ····················· URLs para mostrar datos ·························· //
// # ------------------------------------------------------------------------ //
alumnControllers.searchAlumn = async (req, res) => {
    //console.log(req.params)
    var { nombre, apellido, DNI } = req.params
    const datAlumn = await alumn.findOne({
        nombre: nombre,
        apellido: apellido,
        DNI: DNI,
    })
    //console.log(datAlumn)
    res.json(datAlumn)
}



module.exports = alumnControllers