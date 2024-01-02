const moongose = require('mongoose');
const { Schema, model } = moongose

const saldoSchema = new Schema({
    NumeroBoleta: {
        type: Number,
        required: true
    },
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
    SaldoDeudor: {
        type: Number,
        required: true
    },
    SaldoAcreedor: {
        type: Number,
        required: true
    },
    saldoAcreedorUsado:{
        type: Number,
        //default: 0,
        required: true
    },
    ultimFechUsoSaldoFavor: {
        type: Date,
        required: true,
    },
    Estado: {
        type: String,
        enum : ['pago_total','pago_parcial', 'saldo_a_favor', 'vencida'],
        required: true
    },
    IdPagoConjunto: {
        type: Schema.Types.ObjectId
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