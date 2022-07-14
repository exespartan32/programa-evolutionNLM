const moongose = require('mongoose');
const { Schema, model } = moongose

const cursoSchema = new Schema({
    nombreCurso: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
    },
    fechaModificacion: {
        type: Date,
        default: null
    },
    fechaEliminacion: {
        type: Date,
        default: null
    },
    valorMesCurso:[],
    alumnos:[]
})

module.exports = model('cursos', cursoSchema)