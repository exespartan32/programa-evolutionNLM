const moongose = require('mongoose');
const { Schema, model } = moongose

const precioCursoSchema = new Schema({
    mes:{
        type: String,
        required: true
    },
    precioMes: {
        type: Number,
        required: true
    },
    nombreCurso:{
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
    }
})

module.exports = model('precioMes', precioCursoSchema)