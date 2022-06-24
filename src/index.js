const app = require('./server')
require('./database')
require('dotenv').config();

const port = app.get('port')


//--------------------------------------------------------------------------------------//
//···························· server is listenning ····································//
//--------------------------------------------------------------------------------------//
app.listen(port,  () => {
    console.log("App corriendo en el puerto " + port + "!")
    //console.log("App corriendo en el puerto 3000!")
})