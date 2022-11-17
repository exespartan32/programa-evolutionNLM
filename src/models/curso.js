const moongose = require('mongoose');
const { Schema, model } = moongose

const cursoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    fechaInicioCurso:{
        type: Date,
        required: true
    }, 
    fechaFinCurso:{
        type: Date,
        required: true
    }, 
    fechaCreacion: {
        type: Date,
        required: true
    },
    fechaModificacion: {
        type: Date,
        default: null
    },
    fechaEliminacion: {
        type: Date,
        default: null
    },
})
module.exports = model('curso', cursoSchema)