$('#precioMes').on('change', function () {
    var valorActual = $(this).val()

    if (valorActual < 1) {
        alert("no puede colocar un saldo menor a 1")
        $(this).val('')
    }
})

$('#mes').on('change', function () {
    var valorActual = $(this).val()
    var numeroMeses = $('#numeroMeses')
    var nombreMeses = $('#nombreMeses')
    var precioMeses = $('#precioMeses')

    if (numeroMeses.length > 0) {
        var ArrayNumeroMeses = numeroMeses.val().split(',')
        var ArrayNombreMeses = nombreMeses.val().split(',')
        var ArrayPrecioMeses = precioMeses.val().split(',')

        for (let i = 0; i < ArrayNumeroMeses.length; i++) {
            if (ArrayNumeroMeses[i] == valorActual) {
                alert(`el mes de ${ArrayNombreMeses[i]} ya tiene precio asignado`)
                $(this).val('')
            }
        }
    }

})