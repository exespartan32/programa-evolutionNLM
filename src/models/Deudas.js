const moongose = require('mongoose');
const {Schema, model} = moongose

const deudaSchema = new Schema({
    nombreAlumno: {
        type: String,
        required: true
    },
    apellidoAlumno:{
        type: String,
        required: true
    },
    deuda: {
        type: Number,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('Deudas', deudaSchema)