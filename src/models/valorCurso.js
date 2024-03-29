const moongose = require('mongoose');
const { Schema, model } = moongose

const valorCurso = new Schema({
    mes: {
        type: String,
        required: true
    },
    precioMes: {
        type: Number,
        required: true
    },
    idCurso: [{
        type: Schema.Types.ObjectId, ref: 'curso',
        required: true
    }],
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
        default: null
    },
})
module.exports = model('valor_Mes_Curso', valorCurso)