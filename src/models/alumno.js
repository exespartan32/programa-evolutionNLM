const moongose = require('mongoose');
const { Schema, model } = moongose

const alumnoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    DNI: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    offset: {
        type: Number,
    },
    fechaModificacion: {
        type: Date,
        default: null
    },
    fechaEliminacion: {
        type: Date,
    },
})
module.exports = model('alumno', alumnoSchema)