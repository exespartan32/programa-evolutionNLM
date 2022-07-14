const moongose = require('mongoose');
const {Schema, model} = moongose

const pagoSchema = new Schema({
    Alumno: [],
    pagoAlumno: {
        type: Number,
        required: true
    },
    pagoMes: {
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

module.exports = model('Pagos', pagoSchema)