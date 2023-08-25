// TODO: variables globales
var mesesLista = []
var inputMesesLista = ['#mes']
var dataMes = {
    nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
}
var inputsMeses = {
    idMes: [
        "#mes1",
        "#mes2",
        "#mes3",
        "#mes4"
    ], value: [
        "2023-03",
        "2023-04",
        "2023-05",
        "2023-06"
    ]
}


// TODO: -----------------------------------------------------------------------------------------
// TODO: -----------------------------------------------------------------------------------------
// TODO: --------------------------------------- funciones ---------------------------------------
// TODO: -----------------------------------------------------------------------------------------
// TODO: -----------------------------------------------------------------------------------------


function funValidMonth(idCurso, idItemMes) {
    var mes = $(idItemMes).val()
    var numeroMes = $('#numerMonth').val()
    var mesesDB = numeroMes.split(",")

    //!: cuando el mes seleccionado no tiene precio asignado
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
                let priceMonthContainer = $('#priceMonthContainer')
                var numItem = idItemMes.at(-1)
                var precioMes = data[0].precioMes
                var numeroMes = mes.split('-')[1]
                var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]

                inputsMeses.idMes.push(idItemMes)
                inputsMeses.value.push(mes)

                console.log("id del input actual: " + idItemMes)
                console.log("datos del input actual: " + mes)
                console.log(inputsMeses)

                var indexOfIdMes = inputsMeses.idMes.indexOf(idItemMes)
                var valueindexOfIdMes = inputsMeses.value[indexOfIdMes]


                for (let i = 0; i < indexOfIdMes-1; i++) {
                    console.log("antes de :"+indexOfIdMes)
                }

                for (let i = indexOfIdMes; i < inputsMeses.value.length; i++) {
                    console.log("despues de :"+indexOfIdMes)
                }



                if (valueindexOfIdMes != mes) {
                    //console.log("actualizar en la lista")
                    inputsMeses.value.pop()



                    //var newArray = (inputsMeses.value.filter((item) => item == mes)).length
                    //console.log(newArray)
                }








                /* 
                
                
                                var idContainer = `#priceMonth${numItem}`
                                var itemi = $(`#priceMonth${numItem}`)
                                var container = $(priceMonthContainer).html()
                
                                if(container.includes(`id="priceMonth${numItem}"`)){
                                    $(idContainer).remove()
                                    inputsMeses.idMes.pop(idItemMes)
                                    inputsMeses.value.pop(mes)
                                    console.log(inputsMeses)
                                } 
                
                                priceMonthContainer.append(`
                                <div class="mx-auto justify-content-center input-group mb-2" id="priceMonth${numItem}">
                                    <label class="bg-light-subtle text-primary-emphasis input-group-text" >el mes de ${nombreMes} tiene un precio de : ${precioMes}</label>
                                    <div class="input-group-prepend">
                                        <span class="text-primary-emphasis input-group-text">$</span>
                                    </div>
                                </div>
                                `)*/


                /*                 var newArray = (inputsMeses.value.filter((item) => item == mes)).length
                                if (newArray > 1) {
                                    alert("el mes ya ha sido seleccionado con anterioridad")
                                    $(idItemMes).val('')
                                } */



            }
        })
    }
}

function addMonth(idCourse, duracion) {
    //alert("id del curso: " + idCourse)
    //alert("duracion de curso: "+ duracion + " meses")
    //%: cargamos los datos del curso (fecha inicio y finalizacion)
    $.ajax({
        url: '/payment/loadMonths/' + idCourse,
        type: 'get',
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var incioCurso = data.dataCourse.fechaInicioCurso
            var finCurso = data.dataCourse.fechaFinCurso

            var conteinerTodo = $('#containerMonthGeneral')
            var monthNumber = $('#containerMonthGeneral').find('div').length
            mesesLista.push((monthNumber + 1))
            inputMesesLista.push(`#mes${monthNumber + 1}`)
            var ultimoLista = mesesLista.at(-1)
            //alert(ultimoLista)

            var idCourse = $('#idCourse').val()
            //alert(mesesLista)

            var monthNumber = $('#containerMonthGeneral').find('div').length

            if (monthNumber >= duracion) {
                alert(`el curso dura solo ${duracion} meses, y no puede agregar mas que esos meses`)
            } else {
                conteinerTodo.append(`
                    <div class="input-group mb-2" id="containerMes${ultimoLista}">
                        <label class="input-group-text" for="mes${ultimoLista}">Mes Nº ${ultimoLista} a pagar</label>
                        <input type="month" id="mes${ultimoLista}" name="mes${ultimoLista}" min="${incioCurso}"
                            max="${finCurso}" class="form-control imput-month"
                            name="trip-start" onchange="funValidMonth('${idCourse}', '${inputMesesLista.at(-1)}', '#priceMonth${ultimoLista}')">
                    </div>
                `)

                $('#containerPagos').append(`
                    <div class="input-group mb-2" id="containerPagoNº${ultimoLista}">
                        <label for="pagoAlumno${ultimoLista}" class="input-group-text">ingresar el pago Nº ${ultimoLista} del alumno</label>
                        <input type="number" class="form-control imput"
                            aria-label="Amount (to the nearest dollar)" id="pagoAlumno${ultimoLista}" name="pagoAlumno${ultimoLista}"
                            placeholder="ingresar precio del mes">
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
        $(mesAborrar).remove()
        $(pagoBorrar).remove()
    })
})


