priceCourseControllers = {};
const course = require('../models/Cursos');
const priceCourse = require('../models/ValorMesCurso');

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
    res.render('cursos/precioCursos/addPriceCourse', { dataCurso })
}

// guardar valor del mes del curso y actualizar data del curso
priceCourseControllers.savePriceMonth = async (req, res) => {
    const { mes, precioMes, nombreCurso } = req.body
    const errors = [];

    // comprobamos si se reciben campos vacios
    if (!mes || !precioMes) {
        req.flash('error_msg', 'no deben de haber campos vacios');
        errors.push("")
    }
    // si hay campos vacios se redirecciona a /course/selectCourse
    if (errors.length > 0) {
        res.redirect('/course/selectCourse')

        // si no hay campos vacios 
    } else {
        const costCourse = new priceCourse({ mes: mes, precioMes: precioMes, nombreCurso: nombreCurso, fechaCreacion: new Date() })

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
            const saveCourse = await costCourse.save()
            const idPC = saveCourse._id
            const mesPC = saveCourse.mes
            const precioPC = saveCourse.precioMes

            const PrecioMes = {}
            PrecioMes._id = idPC;
            PrecioMes.mes = mesPC
            PrecioMes.precioMes = precioMes

            const addMonthCourse = await course.update(
                { nombreCurso: nombreCurso }, { $push: { valorMesCurso: PrecioMes } },
            )
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
    const id = req.params.id
    const data = await course.findById(id);
    const dataPC = data.valorMesCurso
    res.render('cursos/precioCursos/selectActionCourse', {
        dataPC,
    })
}

// --------------------------------------------------------------- //
// ··················· editar precio del curso ··················· //
// --------------------------------------------------------------- //
priceCourseControllers.renderEditPrice = async (req, res) => {
    const id = req.params.id
    const dataPrice = await priceCourse.findById(id);
    res.render('cursos/precioCursos/editPriceCourse', { dataPrice })
}

priceCourseControllers.saveEditCourse = async (req, res) => {
    const id = req.params.id
    const { mes, precioMes, nombreCurso } = req.body

    const updatePC = await priceCourse.findByIdAndUpdate(id, {
        $set: {
            precioMes: precioMes,
            mes: mes
        }
    })

    const busqueda = await course.find({
        nombreCurso: nombreCurso
    })

    const meses = busqueda[0].valorMesCurso

    var idMesDB = ''
    var mesDB = ''
    var precioDB = ''
    for (var i = 0; i < meses.length; i++) {

        const iditem = meses[i]._id
        const mesItem = meses[i].mes
        const precioitem = meses[i].precioMes

        if (iditem == id) {
            idMesDB = iditem
            mesDB = mesItem
            precioDB = precioitem
        }
    }

    if (!idMesDB) {
        req.flash('error_msg', '!!error¡¡ hay una incongruencia de datos en la base de datos, por favor contacte con el administrador del sistema');
        res.redirect('/course/selectCoursePriceAction')
    } else {
        
        const query = { nombreCurso: nombreCurso };
        const updateDocument = {
          $set: { 
            "valorMesCurso.$[item].mes": mes,
            "valorMesCurso.$[item].precioMes": precioMes
        } 
        };
        const options = {
          arrayFilters: [
            {
                "item.mes": mesDB,
            },
          ]
        };
    
        const result = await course.findOneAndUpdate(query, updateDocument, options);
        //console.log(result)

        if(!result){
            res.send('error no se pudo actualizar la tabla cursos')
        }else{
            req.flash('success_msg', 'precio del curso de' + nombreCurso + 'editado correctamente');
            res.redirect('/course/selectCoursePriceAction')
        }

/* 
        const updateTableCurse = course.findOneAndUpdate(
            { nombreCurso: nombreCurso },
            {
                "$set": {
                    "valorMesCurso.$[elem].mes": mes,
                    "valorMesCurso.$[elem].precioMes": precioMes,
                }
            },
            {
                arrayFilters: [{
                    "elem.mes": mesDB,
                }]
            },
            {new: true},
        )

        console.log(updateTableCurse)

 */
    }



    /*
        const query = { nombreCurso: "manicura" };
        const updateDocument = {
          $set: { 
            "valorMesCurso.$[item1].mes.$": "mes",
        } 
        };
        const options = {
          arrayFilters: [
            {
                "item1._id": "6310f3d679cf3e0b8837620f",
            },
          ]
        };
    
        const result = await course.updateOne(query, updateDocument, options);
    
        console.log(result)
    
    
        db.cursos.updateMany(
            { nombreCurso: "manicura" },
            { $set: { 
                "valorMesCurso.$[elem].mes" : "2022-03",
                "valorMesCurso.$[elem].precioMes" : 2000,
            } },
            { arrayFilters: [ { "elem.mes":  "2022-04"  } ] }
         )
    
        
        const updatePCCur = await course.updateOne(
            { nombreCurso: nombreCurso }, 
            {$set:{ 'ValorMesCurso.$': mes }}
        )
        
        
        console.log(updatePCCur)
        res.send('ok')
    
        req.flash('success_msg', 'precio del curso de' + nombreCurso + 'editado correctamente');
        res.redirect('/course/selectCoursePriceAction')
    
     
        ObjectId("62d91250f25a422504676a9a")
     
        const prueba = course.update(
            { "nombreCurso": { $eq: nombreCurso } },
            {
                $set: {
                    "valorMesCurso.$[value].precioMes": new Date(),
                    //"valorMesCurso.$[value].mes": mes,
                    //"valorMesCurso.$[value].precioMes": precioMes,
                }
            },
            { arrayFilters: [{ "value._id": { $eq: id } }] }
        )
     
     
        req.flash('success_msg', 'precio del curso de' + nombreCurso + 'editado correctamente');
        res.redirect('/course/selectCoursePriceAction')
     
         
        await priceCourse.findByIdAndUpdate(id, {
            mes,
            precioMes,
            fechaModificacion: new Date()
        })
        const dataPriceCourse = await priceCourse.findById(id);
       
     
        const data = course.update({ 'valorMesCurso._id': id }, {
            '$set': {
                'valorMesCurso.$.fechaModificacion': new Date(),
                'valorMesCurso.$.precioMes': precioMes,
                'valorMesCurso.$.mes': mes
            }
        })
        
        
        const data = await course.updateOne(
            { "nombreCurso": nombreCurso, "valorMesCurso._id": id },
            {
                $set: {
                    "valorMesCurso.$.fechaModificacion": new Date(),
                    "valorMesCurso.$.mes": mes,
                    "valorMesCurso.$.precioMes": precioMes,
                }
            }
        )
        */


    //req.flash('success_msg', 'precio del curso de' + nombreCurso + 'editado correctamente');
    //res.redirect('/course/selectCoursePriceAction')
}

priceCourseControllers.deleteCourse = async (req, res) => { }



module.exports = priceCourseControllers;