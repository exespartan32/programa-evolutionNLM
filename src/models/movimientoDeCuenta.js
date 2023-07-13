const moongose = require('mongoose');
const { Schema, model } = moongose

const saldoSchema = new Schema({
    idCurso: [{
        type: Schema.Types.ObjectId, ref: 'curso',
        required: true
    }],
    idAlumno: [{
        type: Schema.Types.ObjectId, ref: 'alumno',
        required: true
    }],
    idValorCurso: [{
        type: Schema.Types.ObjectId, ref: 'valor_Mes_Curso',
        required: true
    }],
    Debe: {
        type: Number,
        required: true
    },
    Haber: {
        type: Number,
        required: true
    },
    Deudor: {
        type: Number,
        required: true
    },
    Acreedor: {
        type: Number,
        required: true
    },
    Comentario: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        required: true,
        //format: "Day %d of Month %m (Day %j of year %Y) at %H hours, %M minutes, and %S seconds (timezone offset: %UTC-3000)",
        timezone: "America/Argentina/Buenos_Aires",

    },
    offset: {
        type: Number,
        //required: true,
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