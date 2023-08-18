$(function validExistMonth() {
    $('#mes').on('change', function () {
        var mes = $('#mes').val()
        var numeroMes = $('#numerMonth').val()
        var mesesDB = numeroMes.split(",")

        //TODO: validamos si el mes seleccionado tiene precio
        var coincidencias = mesesDB.includes(mes)
        if (!coincidencias) {
            alert("el mes seleccionado no tiene un precio asignado")
            $('#mes').val('')
            $('#priceMonthContainer').html('')
        } else {
            $.ajax({
                url: '/payment/loadPriceMonth',
                success: function (listaPrecioMeses) {
                    let priceMonthContainer = $('#priceMonthContainer')
                    priceMonthContainer.html('')
                    listaPrecioMeses.forEach((mesData, indice) => {
                        //console.log('Indice: ' + indice + ' Valor: ' + mesData.mes);
                        //console.log("mes seleccionado: "+ mes)
                        if (mesData.mes == mes) {
                            priceMonthContainer.html(`
                            <label class="input-group-text">el precio del mes es de: ${mesData.precioMes}</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            `)

                            var mesObject = { mes: mes }
                            $.ajax({
                                url: '/payment/loadDebitMonth/'+mes,
                                type: 'get',
                                dataType: "json",
                                //data: mesObject,
                                success: function (data) {
                                    let debtMonthContainer = $('#debtMonthContainer')
                                    if(data){
                                        console.log("el mes tiene una deuda de: "+ data.SaldoDeudor + " $")
                                        priceMonthContainer.html(`
                                        <label class="input-group-text">el mes seleccionado tiene de una deuda de ${data.SaldoDeudor}</label>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">$</span>
                                        </div>
                                        `)
                                    }
                                }
                            })


                        }
                    })
                }
            })



        }
    })
})




