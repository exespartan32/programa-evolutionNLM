const mongoose = require('mongoose')
require('dotenv').config();

const { APP_MONGODB_HOST, APP_MONGODB_DATABASE } = process.env
//console.log('database: '+APP_MONGODB_HOST)
//console.log('database: '+APP_MONGODB_DATABASE)

const MONGODB_URI = `mongodb://${APP_MONGODB_HOST}/${APP_MONGODB_DATABASE}`


//const MONGODB_URI = 'mongodb://localhost/evolutionNLM'


mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(db => console.log('conexion a base de datos exitosa'))
.catch(err => console.log(err))