const moongose = require('mongoose');
const { Schema, model } = moongose
const bcrypt = require('bcryptjs')

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        nombre: { type: String, trim: true },
        apellido: { type: String, trim: true },
        nombreUsuario: { type: String, trim: true },
        password: { type: String, required: true },
        fechaCreacion: { type: Date, default: Date.now },
        offset: { type: Number},
    },
/*     {
        timestamps: true,
        versionKey: false,
    } */
)

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare
};

module.exports = model('User', UserSchema);
