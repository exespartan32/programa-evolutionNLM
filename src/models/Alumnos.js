const moongose = require('mongoose');
const { Schema, model } = moongose

const alumnosSchema = new Schema({
    nombreAlumno: {
        type: String,
        required: true
    },
    apellidoAlumno: {
        type: String,
        required: true
    },
    DNI: {
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
    cursos:[]
})

module.exports = model('alumnos', alumnosSchema)