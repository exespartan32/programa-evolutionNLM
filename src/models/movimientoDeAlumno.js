const moongose = require('mongoose');
const { Schema, model } = moongose

const alumnosSchema = new Schema({
    idCurso: [{
        type: Schema.Types.ObjectId, ref: 'curso',
        required: true
    }],
    idAlumno: [{
        type: Schema.Types.ObjectId, ref: 'alumno',
        required: true
    }],
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
module.exports = model('movimientoDeAlumno', alumnosSchema)