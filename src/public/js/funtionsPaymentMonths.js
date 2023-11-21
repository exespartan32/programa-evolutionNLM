// TODO: variables globales
var mesesLista = [1]
var inputMesesLista = ['#mes1']
var dataMes = {
    nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
}
var inputsMeses = { idMes: [], value: [] }


// TODO: -----------------------------------------------------------------------------------------
// TODO: -----------------------------------------------------------------------------------------
// TODO: --------------------------------------- funciones ---------------------------------------
// TODO: -----------------------------------------------------------------------------------------
// TODO: -----------------------------------------------------------------------------------------


function funValidMonth(idCurso, idItemMes, priceMonth1) {
    var mes = $(idItemMes).val()
    var numeroMes = $('#numerMonth').val()
    var mesesDB = numeroMes.split(",")
    var coincidencias = mesesDB.includes(mes)

    if (!coincidencias) {
        alert("el mes seleccionado no tiene un precio asignado")
        $('#mes').val('')
        $('#priceMonthContainer').html('')
    }
    //%: validamos el mes seleccionado
    else {
        $.ajax({
            url: '/payment/loadPriceMonth/' + mes,
            success: function (data) {
                var numItem = idItemMes.at(-1)
                var precioMes = data[0].precioMes
                var numeroMes = mes.split('-')[1]
                var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]

                var lengthIdMes = inputsMeses.idMes.length

                var lengthMonth = parseInt($('#containerMeses').find('div').length)

                var indexOfIdMes = inputsMeses.idMes.indexOf(idItemMes)
                var valueindexOfIdMes = inputsMeses.value[indexOfIdMes]

                var numeroDiv = lengthMonth + 1

                var idAlumno = $('#idAlumno').val()
                if (idAlumno) loadDebtMonth()

                if (lengthMonth == 1) {
                    if (lengthIdMes == 0) {
                        inputsMeses.idMes.push(idItemMes)
                        inputsMeses.value.push(mes)
                    } else {
                        inputsMeses.value[indexOfIdMes] = mes
                    }
                    var element = document.getElementById("containerPagoNº1")
                    var mensaje = `el precio de ${nombreMes} tiene un precio de ${precioMes}$`
                    element.setAttribute("title", mensaje)
                }
                if (lengthMonth == 2) {
                    if ($('#mes1').val() == $('#mes2').val()) {
                        alert("el mes ya ha sido seleccionado con anterioridad")
                        $(idItemMes).val('')
                    } else {
                        inputsMeses.idMes.push(idItemMes)
                        inputsMeses.value.push(mes)
                        var element = document.getElementById(`containerPagoNº${numItem}`)
                        var mensaje = `el precio de ${nombreMes} tiene un precio de ${precioMes}$`
                        element.setAttribute("title", mensaje)
                    }
                }
                if (lengthMonth > 2) {
                    for (let i = 1; i < lengthMonth + 1; i++) {
                        if (`#mes${i}` != idItemMes) {
                            if ($(idItemMes).val() == $(`#mes${i}`).val()) {
                                alert("el mes ya ha sido seleccionado con anterioridad")
                                $(idItemMes).val('')
                            } else {
                                inputsMeses.idMes.push(idItemMes)
                                inputsMeses.value.push(mes)
                                var element = document.getElementById(`containerPagoNº${numItem}`)
                                var mensaje = `el precio de ${nombreMes} tiene un precio de ${precioMes}$`
                                element.setAttribute("title", mensaje)
                            }
                        }
                    }
                }

            }
        })
    }
}

function addMonth(idCourse, duracion) {
    //%: cargamos los datos del curso (fecha inicio y finalizacion)
    $.ajax({
        url: '/payment/loadMonths/' + idCourse,
        type: 'get',
        dataType: "json",
        success: function (data) {
            var incioCurso = data.dataCourse.fechaInicioCurso
            var finCurso = data.dataCourse.fechaFinCurso

            var monthNumber = parseInt($('#containerMeses').find('div').length)
            var numeroDiv = monthNumber + 1

            mesesLista.push((numeroDiv))
            inputMesesLista.push(`#mes${numeroDiv}`)

            var ultimoLista = mesesLista.at(-1)
            var ultimoListaIdMes = inputMesesLista.at(-1)

            if (monthNumber >= duracion) {
                alert(`el curso dura solo ${duracion} meses, y no puede agregar mas que esos meses`)
            } else {
                $('#containerMeses').append(`
                                <div class="input-group mb-1" id="containerMes${ultimoLista}">
                                    <label class="input-group-text" for="mes${ultimoLista}">Mes Nº${ultimoLista}</label>
                                    <input type="month" id="mes${ultimoLista}" name="mes${ultimoLista}" min="${incioCurso}" 
                                    max="${finCurso}" class="form-control imput-month" name="trip-start" 
                                    onchange="funValidMonth('${idCourse}', '${ultimoListaIdMes}', '#priceMonth${ultimoLista}')">
                                </div>
                            `)

                $('#containerPagosMeses').append(`
                                <div class="input-group mb-1" id="containerPagoNº${ultimoLista}" title="">
                                    <label for="pagoAlumno${ultimoLista}" class="input-group-text">Pago Nº${ultimoLista}</label>
                                    <input type="number" class="form-control imput" id="pagoAlumno${ultimoLista}" name="pagoAlumno${ultimoLista}">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                </div>
                            `)
            }
        }
    })
}

$(function deleteMonth() {
    var listIDMonths = ['#mes', '#mes2', '#mes3', '#mes4', '#mes5', '#mes6', '#mes7', '#mes8', '#mes9', '#mes10', '#mes11', '#mes12']
    $('#deleteMonth').on('click', function () {
        var ultimoLista = mesesLista.at(-1)
        mesesLista.pop(ultimoLista)
        inputMesesLista.pop(inputMesesLista.at(-1))
        var mesAborrar = `#containerMes${ultimoLista}`
        var pagoBorrar = `#containerPagoNº${ultimoLista}`

        if (mesAborrar != `#containerMes1`) {
            $(mesAborrar).remove()
            $(pagoBorrar).remove()
        }
    })
})

$(function findDebt() {
    $('#idAlumno').on('change', loadDebtMonth)
})


function loadDebtMonth() {
    var monthNumber = parseInt($('#containerMeses').find('div').length)
    var numeroDiv = monthNumber + 1
    var idAlumno = $('#idAlumno').val()

    for (let i = 1; i < numeroDiv; i++) {
        var mesI = $(`#mes${i}`).val()
        //console.log(mesI)
        if (mesI && idAlumno) {
            $.ajax({
                url: '/payment/loadDebitMonth/' + mesI + "/" + idAlumno,
                type: 'get',
                dataType: "json",
                //data: mesObject,
                success: function (data) {
                    //console.log(data)
                    var ultimoElemento = data[1].at(-1)
                    console.log(ultimoElemento)
                    console.log(ultimoElemento.Estado == 'pago_parcial')

                    if (ultimoElemento.Estado == 'pago_parcial') {
                        var numeroMes = data[0].mes.split('-')[1]
                        var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]
                        //console.log(nombreMes)
                        //l mes ${data[0].mes} de ${nombreMes} tiene una deuda de ${data[1].SaldoDeudor}$`)
                        var mensaje = $(`#deuda${nombreMes}`)
                        if (mensaje.length == 0) {
                            $('#debtMonthContainer').append(`
                                        <div class="alert alert-danger alert-dismissible fade show" role="alert" id="deuda${nombreMes}">
                                        el mes de ${nombreMes}(${data[0].mes}) tiene una deuda de ${data[1].SaldoDeudor}$ </strong>
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                        `)
                        }
                    }
                    if (ultimoElemento.Estado == 'pago_total' || ultimoElemento.Estado == 'saldo_a_favor') {
                        alert('el mes seleccionado ya ha sido pagado en su totalidad')
                        $(`#mes${i}`).val('')
                    }
                }
            })
        }
    }
}