const moongose = require('mongoose');
const { Schema, model } = moongose

const saldoSchema = new Schema({
    idMovimientoCuenta: [{
        type: Schema.Types.ObjectId, ref: 'movimiento_De_Cuenta',
        required: true
    }],
    Saldo: {
        type: Number,
    },
    SaldoTotal: {
        type: Number,
    },
    fechaCreacion: {
        type: Date,
        required: true,
        timezone: "America/Argentina/Buenos_Aires",

    },
    offset: {
        type: Number,
    },
})
module.exports = model('movimiento_De_Saldo', saldoSchema)