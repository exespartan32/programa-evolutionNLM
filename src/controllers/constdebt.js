const debtsData = await Deudas.find({
    nombreAlumno: { $eq: nombre },
    apellidoAlumno: { $eq: apellido }
})


module.exports = {debtsData}

