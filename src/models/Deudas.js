const moongose = require('mongoose');
const { Schema, model } = moongose

const deudaSchema = new Schema({
    alumno:[],
    deuda: {
        type: Number,
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

module.exports = model('Deudas', deudaSchema)