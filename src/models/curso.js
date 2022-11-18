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
        type: String,
        required: true
    }, 
    fechaFinCurso:{
        type: String,
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