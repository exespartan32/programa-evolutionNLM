priceCourseControllers = {};
const course = require('../models/curso');
const priceCourse = require('../models/valorCurso');
const moment = require('moment-timezone');

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

    var init = dataCurso.fechaInicioCurso
    var end = dataCurso.fechaFinCurso

    //console.log(init.toUTCString())
    const dateInit = new Date(init)
    console.log(dateInit)
    console.log(dateInit.getUTCMonth())
    console.log(dateInit.getFullYear())
    console.log(dateInit.getDay())

/*
    //var dateInit = new Date(init)
    var dateInit = init.toUTCString()
    var dateEnd = end.toUTCString()

    var parsInit = new Date(dateInit)
    console.log(parsInit.getFullYear())
    console.log(parsInit.getMonth())

    //const dateArg = moment.tz(dateInit, 'America/Argentina/Mendoza')
    //console.log(dateArg)
 
        console.log("año: "+ parsInit.getFullYear())
        console.log("getDate() "+parsInit.getDate())
        console.log("getDay() "+parsInit.getDay())
        console.log("getHours() "+parsInit.getHours())
        console.log("getMinutes() "+parsInit.getMinutes())
        console.log("getMilliseconds() "+parsInit.getMilliseconds())
        console.log("getMonth() "+parsInit.getMonth())
        console.log("getSeconds() "+parsInit.getSeconds())
        console.log("getTime() "+parsInit.getTime())
        console.log("getYear() "+parsInit.getYear())
        console.log("getFullYear() "+parsInit.getFullYear())
        console.log("getTimezoneOffset() "+parsInit.getTimezoneOffset())
        console.log("getUTCDay() "+parsInit.getUTCDay())
        console.log("getUTCFullYear() "+parsInit.getUTCFullYear())
        console.log("getUTCHours() "+parsInit.getUTCHours())
        console.log("getUTCMilliseconds() "+parsInit.getUTCMilliseconds())
        console.log("getUTCMinutes() "+parsInit.getUTCMinutes())
        console.log("getUTCMilliseconds() "+parsInit.getUTCMilliseconds())
        console.log("getUTCMonth() "+parsInit.getUTCMonth())
        console.log("getUTCSeconds() "+parsInit.getUTCSeconds() ) */

    res.render('cursos/precioCursos/addPriceCourse', { dataCurso,  })
}

// guardar valor del mes del curso y actualizar data del curso
priceCourseControllers.savePriceMonth = async (req, res) => {
    const idCurso = req.params.id
    //console.log("id del curso "+idCurso)
    const { mes, precioMes } = req.body
    const errors = [];

    // comprobamos si se reciben campos vacios
    if (!mes || !precioMes) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        res.redirect('/course/selectCourse')
    } else {
        const costCourse = new priceCourse({
            mes: mes,
            precioMes: precioMes,
            idCurso: idCurso,
            fechaCreacion: new Date()
        })
        // comprobamos que no exista el valor de ese mes en la DB
        const courseAction = await priceCourse.find({
            mes: { $eq: mes }
        })
        // si existe en la DB redireccionamos a /course/selectCourse
        if (courseAction.length > 0) {
            req.flash('error_msg', 'el mes seleccionado ya tiene precio');
            res.redirect('/course/selectCourse')
            // si no existe en la DB lo gurdamos en la tabla valorCurso y Curso
        } else {
            await costCourse.save()
            req.flash('success_msg', 'precio agregado correctamente');
            res.redirect('/course/selectCourse')
        }
    }
}

// --------------------------------------------------------------- //
// ·········· render edit o delete precio delcourse ·············· //
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
    const idCurso = req.params.id
    const dataCourse = await course.findById(idCurso)

    const dataPC = await priceCourse.find({
        idCurso: { $eq: idCurso },
        fechaEliminacion: { $eq: null }
    })

    res.render('cursos/precioCursos/selectActionCourse', {
        dataPC,
        dataCourse
    })
}

// --------------------------------------------------------------- //
// ··················· editar precio del curso ··················· //
// --------------------------------------------------------------- //
priceCourseControllers.renderEditPrice = async (req, res) => {
    const id = req.params.id
    const dataPrice = await priceCourse.findById(id);
    //console.log(dataPrice)
    //res.send('respuesta de edit')



    res.render('cursos/precioCursos/editPriceCourse', { dataPrice })
}

priceCourseControllers.saveEditCourse = async (req, res) => {
    const id = req.params.id
    const { mes, precioMes } = req.body


    const dataDB = await priceCourse.findById(id)

    console.log(dataDB)
    console.log(dataDB.mes)
    console.log(dataDB.precioMes)

    const updatePC = await priceCourse.findByIdAndUpdate(id, {
        $set: {
            precioMes: precioMes,
            mes: mes,
            fechaModificacion: new Date()
        }
    })

    if (!updatePC) {
        req.flash('error_msg', 'error no se pudo actualizar la tabla cursos')
        res.redirect('/course/selectCoursePriceAction')
    } else {
        req.flash('success_msg', 'precio y mes modificado correctamente')
        res.redirect('/course/selectCoursePriceAction')
    }




    /*     if (dataDB.mes == mes && dataDB.precioMes == precioMes) {
            req.flash('success_msg', 'no se modifico nada')
            res.redirect('/course/selectCoursePriceAction')
            //res.send("no se modifico nada")
        }
    
        if (dataDB.mes == mes && dataDB.precioMes != precioMes) {
            const updatePC = await priceCourse.findByIdAndUpdate(id, {
                $set: {
                    precioMes: precioMes,
                    mes: mes,
                    fechaModificacion: new Date()
                }
            })
    
            if (!updatePC) {
                req.flash('error_msg', 'error no se pudo actualizar la tabla cursos')
                res.redirect('/course/selectCoursePriceAction')
            } else {
                req.flash('success_msg', 'precio modificado correctamente')
                res.redirect('/course/selectCoursePriceAction')
            }
        }
    
        if (dataDB.mes != mes && dataDB.precioMes != precioMes) {
            const updatePC = await priceCourse.findByIdAndUpdate(id, {
                $set: {
                    precioMes: precioMes,
                    mes: mes,
                    fechaModificacion: new Date()
                }
            })
    
            if (!updatePC) {
                req.flash('error_msg', 'error no se pudo actualizar la tabla cursos')
                res.redirect('/course/selectCoursePriceAction')
            } else {
                req.flash('success_msg', 'precio y mes modificado correctamente')
                res.redirect('/course/selectCoursePriceAction')
            }
        }
        if(dataDB.mes == mes){
            res.send("mes ya existe")
        }else{
            if (dataDB.mes == mes && dataDB.precioMes != precioMes) {
                res.send("precio actualizao")
            }
        } */



}

// --------------------------------------------------------------- //
// ··················· dar de baja a precio ······················ //
// --------------------------------------------------------------- //
priceCourseControllers.deleteCourse = async (req, res) => {
    const id = req.params.id
    const deletePC = await priceCourse.findByIdAndUpdate(id, {
        fechaEliminacion: new Date()
    })

    if (!deletePC) {
        req.flash('error_msg', 'error no se pudo eliminar el curso')
        res.redirect('/course/selectCoursePriceAction')
    } else {
        req.flash('success_msg', 'precio del curso ha sido eliminado correctamente');
        res.redirect('/course/selectCoursePriceAction')
    }
}

// --------------------------------------------------------------- //
// ··················· dar de alta a precio ······················ //
// --------------------------------------------------------------- //
priceCourseControllers.selectPriceCourseUp = async (req, res) => {
    const selectCoursePCUp = await course.find({
        fechaEliminacion: { $eq: null }
    }).sort({ date: 'desc' });
    const errors = []
    if (selectCoursePCUp.length == 0) {
        errors.push({ text: 'no hay datos para mostrar' })
        res.render('cursos/precioCursos/selectCourse', { errors })
    }
    console.log(selectCoursePCUp)
    res.render('cursos/precioCursos/selectCourse', { selectCoursePCUp })
}

priceCourseControllers.renderAltCourse = async (req, res) => {
    const id = req.params.id
    const data = await course.findById(id)
    const nameCourse = data.nombreCurso

    const dataPC = await priceCourse.find({
        nombreCurso: nameCourse,
        fechaEliminacion: { $ne: null }
    })
    const errors = []
    if (dataPC.length == 0) {
        errors.push({ text: 'no hay cursos borrados que mostrar' })
        res.render('cursos/precioCursos/SelectUpPriceCourse', { errors })
    } else {
        res.render('cursos/precioCursos/SelectUpPriceCourse', { dataPC })
    }
}

priceCourseControllers.saveUpPriceMonth = async (req, res) => {
    const id = req.params.id
    //console.log(id)
    //res.send('ok')
    const dataUpPC = await priceCourse.findByIdAndUpdate(id, {
        fechaEliminacion: null
    })

    req.flash('success_msg', 'precio del curso ha sido restaurado correctamente');
    res.redirect('/course/selectPriceCourseUp')
}


module.exports = priceCourseControllers;