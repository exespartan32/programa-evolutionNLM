const moongose = require('mongoose');
const { Schema, model } = moongose

const saldoSchema = new Schema({
    idAlumno: [{
        type: Schema.Types.ObjectId, ref: 'alumno',
        required: true
    }],
    idValorCurso: [{
        type: Schema.Types.ObjectId, ref: 'valor_Mes_Curso',
        required: true
    }],
    Debe:{
        type: Number,
    },
    Haber:{
        type: Number,
    },
    Saldo:{
        type: Number,
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
    }
})
module.exports = model('movimiento_De_Cuenta', saldoSchema)