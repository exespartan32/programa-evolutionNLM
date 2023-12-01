var dataMes = {
    nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
}

var deudaArray = {
    numeroMes: [],
    deuda: []
}

var dataMesesHTML = {
    numeroMes: [],
    nombreMes: [],
    precioMes: [],
    pagoAlumno: [],
    saldoMes: [],
    deuda: [],
    saldoFavor: [],
}
var mesesDeudores = []

function funValidMonth() {
    var mes = $('#mesInput').val()
    var numeroMes = $('#numerMonth').val()
    var mesesDB = numeroMes.split(",")
    var coincidencias = mesesDB.includes(mes)

    if (!coincidencias) {
        alert("el mes seleccionado no tiene un precio asignado")
        $('#mesInput').val('')
    }
}

$('#idAlumno').on('change', function () {
    //% primero que nada buscamos si tiene saldo a favor
/*     $(document).ready(function () {
        //alert("formulario cargado")
        var idAlumno = $("#idAlumno").val()
        dataMes.nombreMes.forEach(function (itemI, i) {
            $.ajax({
                url: '/payment/loadTotalData/' + itemI + "/" + idAlumno,
                success: function (data) {
                    const dataCourse = data[0]
                    const DataMovAcc = data[1]
    
                    console.log(DataMovAcc)
                }
            })
        }) 
    })
*/

    const tabla = $('#tabla');
    const elementostabla = parseInt(tabla.find('tr').length);

    var mes = $("#mesInput").val()
    var idAlumno = $("#idAlumno").val()
    var numeroMes = mes.split('-')[1]
    var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]

    //?: variables de los datos que contiene el json
    const ArrayNumeroMeses = dataMesesHTML.numeroMes
    const ArrayNombreMeses = dataMesesHTML.nombreMes
    const ArrayPrecioMes = dataMesesHTML.precioMes
    const ArraySaldoMes = dataMesesHTML.saldoMes
    const ArrayDeudaMes = dataMesesHTML.deuda
    const ArrayPagoAlumno = dataMesesHTML.pagoAlumno
    const ArraySaldoFavor = dataMesesHTML.pagoAlumno

    if (elementostabla > 0) {
        ArrayNombreMeses.forEach(function (itemI, i) {
            var numeroMesN = ArrayNumeroMeses[i]
            $.ajax({
                url: '/payment/loadDataMonth/' + numeroMesN + "/" + idAlumno,
                success: function (data) {
                    const dataCourse = data[0]
                    const DataMovAcc = data[1]
                    var precioMes = dataCourse.precioMes

                    //#: datos del HTML 
                    var tablaBodyHTML = $(`#data${itemI}`)
                    var BodyDeudaTablaHTML = $(`#BodyDeuda${itemI}`)
                    BodyDeudaTablaHTML.remove()
                    var precioMesHTML = $(`#precio${itemI}`)

                    //#: variables globales para guardar datos
                    var deuda = 0
                    var favor = 0

                    DataMovAcc.forEach((element, Index) => {
                        deuda = element.SaldoDeudor
                        favor = element.SaldoAcreedor
                    });

                    if (DataMovAcc.length == 0) {
                        //#: seteamos los valores de las deudas por los que tiene el nuevo alumno
                        ArrayDeudaMes[i] = deuda
                        ArraySaldoFavor[i] = favor
                        const itemPagpAlumno = $(`#pagoAlumno${itemI}`)
                        const pagoAlumno = itemPagpAlumno.val()
                        const Index = dataMesesHTML.nombreMes.indexOf(itemI)

                        if (pagoAlumno != "") {
                            itemPagpAlumno.val("")
                            $(`#saldo${itemI}`).val("")
                            $(`#saldo${itemI}`).html("")
                            dataMesesHTML.saldoMes[Index] = 0
                        }

                        if (deuda > 0) {
                            const deudaHTML = $(`#deuda${itemI}`)
                            if (deuda.length == 0) {
                                tablaBodyHTML.append(`
                                    <td id=BodyDeuda${itemI} class="table-danger"><strong class="text-danger">${deuda} $</strong></td>
                                    <input type="hidden" name="deuda${itemI}" id="deuda${itemI}" value=${deuda}>
                                `)
                            } else {
                                tablaBodyHTML.append(`
                                    <td id=BodyDeuda${itemI} class="table-danger"><strong class="text-danger">${deuda} $</strong></td>
                                `)
                            }

                            if (precioMesHTML.length > 0) {
                                precioMesHTML.html("")
                            }

                        } else {
                            tablaBodyHTML.append(`
                                <td id=BodyDeuda${itemI} class="table-info"><strong class="text-primary">sin deuda</strong></td>
                            `)
                            //console.log(`#precio${itemI}`)
                            //console.log(precioMesHTML.html())

                            if (precioMesHTML.html() == "") {
                                precioMesHTML.append(`${precioMes}`)
                            }
                        }
                    } else {

                        var ultimoRegistro = DataMovAcc.at(-1)
                        var estadoPagoUltimo = ultimoRegistro.Estado

                        if (estadoPagoUltimo == "pago_parcial") {
                            console.log("agregar a la lista con la deuda que aun tiene")

                            //#: seteamos los valores de las deudas por los que tiene el nuevo alumno
                            ArrayDeudaMes[i] = deuda
                            const itemPagpAlumno = $(`#pagoAlumno${itemI}`)
                            const pagoAlumno = itemPagpAlumno.val()
                            const Index = dataMesesHTML.nombreMes.indexOf(itemI)
                            //console.log(`pagoAlumno del mes de ${itemI} = ${pagoAlumno}`)

                            if (pagoAlumno != "") {
                                itemPagpAlumno.val("")
                                $(`#saldo${itemI}`).val("")
                                $(`#saldo${itemI}`).html("")
                                dataMesesHTML.saldoMes[Index] = 0
                            }

                            if (deuda > 0) {
                                const deudaHTML = $(`#deuda${itemI}`)

                                if (deuda.length == 0) {
                                    tablaBodyHTML.append(`
                                        <td id=BodyDeuda${itemI} class="table-danger"><strong class="text-danger">${deuda} $</strong></td>
                                        <input type="hidden" name="deuda${itemI}" id="deuda${itemI}" value=${deuda}>
                                    `)
                                } else {
                                    tablaBodyHTML.append(`
                                        <td id=BodyDeuda${itemI} class="table-danger"><strong class="text-danger">${deuda} $</strong></td>
                                    `)
                                }

                                if (precioMesHTML.length > 0) {
                                    precioMesHTML.html("")
                                }

                            } else {
                                tablaBodyHTML.append(`
                                    <td id=BodyDeuda${itemI} class="table-info"><strong class="text-primary">sin deuda</strong></td>
                                `)

                                if (precioMesHTML.html() == "") {
                                    precioMesHTML.append(`${precioMes}`)
                                }
                            }
                        }
                        else {
                            //alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad`)
                            if (estadoPagoUltimo == "saldo_a_favor") {
                                console.log(`el mes de ${itemI} ya ha sido pagado en su totalidad y tiene ${favor}$ de saldo a favor`)
                                ArrayDeudaMeses[i] = deuda

                            }
                            if (estadoPagoUltimo == "pago_total") {
                                console.log(`el mes de ${itemI} ya ha sido pagado en su totalidad`)
                                tablaBodyHTML.remove()
                            }
                        }
                    }
                }
            })
        })
    }
})

$('#agregar_lista').on('click', function () {
    var mes = $("#mesInput").val()
    var idAlumno = $("#idAlumno").val()
    var numeroMes = mes.split('-')[1]
    var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]


    if (!idAlumno) {
        alert("debe seleccionar el alumno que pagara primero")
    } else {
        $.ajax({
            url: '/payment/loadDataMonth/' + mes + "/" + idAlumno,
            success: function (data) {
                //#: datos recibidos del servidor
                const dataCourse = data[0]
                const DataMovAcc = data[1]
                var precioMes = dataCourse.precioMes

                //#: variables globales para guardar datos
                var deuda = 0
                var favor = 0

                DataMovAcc.forEach((element, Index) => {
                    deuda = element.SaldoDeudor
                    favor = element.SaldoAcreedor
                });

                if (data[1].length > 0) {
                    console.log("mes ya pagado con anteridad")
                    var ultimoRegistro = data[1].at(-1)
                    var estadoPago = ultimoRegistro.Estado

                    //console.log(`nombre del mes: ${nombreMes}`)
                    //console.log(`numero del mes: ${mes}`)
                    //console.log(`deuda del mes: ${deuda}`)
                    //console.log(`saldo a favor del mes: ${favor}`)
                    //console.log(`estadoPago: ${estadoPago}`)

                    if (estadoPago == "pago_parcial") {
                        console.log("agregar a la lista con la deuda que aun tiene")
                        agregarTabla(deuda, favor, mes, nombreMes, precioMes)
                    }
                    else {
                        //alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad`)
                        if (estadoPago == "saldo_a_favor") { alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad y tiene ${favor}$ de saldo a favor`) }
                        if (estadoPago == "pago_total") { alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad`) }
                    }

                } else {
                    agregarTabla(deuda, favor, mes, nombreMes, precioMes)
                }
            }
        })
    }
})

function agregarTabla(deuda, favor, mes, nombreMes, precioMes) {
    //#: variables HTML
    const tabla = $('#tabla');
    const HeadTabla = $('#trTable');
    const elementostabla = parseInt(tabla.find('tr').length);
    var HeadDeudaTabla = $(`#HeadDeuda`)
    var BodyDeudaTabla = $(`#BodyDeuda${nombreMes}`)

    //#: si no ha sido guardado antes agregamos el mes seleccionado a la lista
    const busqueda = dataMesesHTML.nombreMes.includes(nombreMes)
    if (!busqueda) {
        //?: agregamos los datos al json para enviar al servidor
        dataMesesHTML.numeroMes.push(mes)
        dataMesesHTML.nombreMes.push(nombreMes)
        dataMesesHTML.precioMes.push(precioMes)
        dataMesesHTML.saldoFavor.push(favor)
        dataMesesHTML.pagoAlumno.push(0)
        if (deuda > 0) {
            dataMesesHTML.deuda.push(deuda)
        } else {
            dataMesesHTML.deuda.push(0)
        }

        //?: agregamos el mes selecciodo a la lista
        tabla.append(`
                                <tr id="data${nombreMes}">
                                    <td class="table-info">${nombreMes}</td>
                                    <input type="hidden" id="numeroMes${nombreMes}" value="${mes}">
                                    <td class="table-info" id="precio${nombreMes}">${precioMes}$</td>
                                    <td class="table-info">
                                        <div class="input-group">
                                            <input class="form-control" type="number" id="pagoAlumno${nombreMes}" 
                                            style="width: 50px;" onchange="agregar_saldo_a_la_lista('${nombreMes}')" required>
                                        </div>
                                    </td>
                                    <td class="table-info" id="saldo${nombreMes}" value=0></td>
                                    <td class="table-info">
                                        <button class="btn btn-outline-danger" type="button" onclick="eliminarPago('${nombreMes}')">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                    <td id=BodyDeuda${nombreMes} class="table-danger"><strong class="text-danger">${deuda} $</strong></td>
                                    <input type="hidden" name="deuda${nombreMes}" id="deuda${nombreMes}" value=${deuda}>
                                </tr>
                        `)

        if ($(`#deuda${nombreMes}`).val() > 0) {
            $(`#precio${nombreMes}`).html("")
        }

        if ($(`#deuda${nombreMes}`).val() == 0) {
            //$(`#BodyDeuda${nombreMes}`).html("Sin Deuda")
            $(`#BodyDeuda${nombreMes}`).replaceWith(`
                                <td id=BodyDeuda${nombreMes} class="table-info"><strong class="text-primary">sin deuda</strong></td>
                            `)
        }
    }
}

function eliminarPago(nombreMes) {
    const index = dataMesesHTML.nombreMes.indexOf(nombreMes)

    dataMesesHTML.numeroMes.splice(index, 1)
    dataMesesHTML.nombreMes.splice(index, 1)
    dataMesesHTML.precioMes.splice(index, 1)
    dataMesesHTML.saldoMes.splice(index, 1)

    $(`#data${nombreMes}`).remove()
}

function agregar_saldo_a_la_lista(nombreMes) {
    $(document).ready(function () {
        const pagoAlumno = $(`#pagoAlumno${nombreMes}`).val()
        const Index = dataMesesHTML.nombreMes.indexOf(nombreMes)
        const precioMes = dataMesesHTML.precioMes[Index]
        const deuda = $(`#deuda${nombreMes}`).val()

        //console.log(`el mes de ${nombreMes} tiene una deuda de ${deuda}`)
        //console.log(`#deuda${nombreMes}`)
        //console.log($(`#deuda${nombreMes}`).html())

        var saldo = 0
        if (deuda > 0) {
            saldo = parseInt(pagoAlumno) - parseInt(deuda)
        } else {
            saldo = parseInt(pagoAlumno) - parseInt(precioMes)
        }
        dataMesesHTML.saldoMes[Index] = saldo
        dataMesesHTML.pagoAlumno[Index] = pagoAlumno

        const saldoMes = $(`#saldo${nombreMes}`)
        saldoMes.html(`${saldo} $`)
    })
}

$(document).ready(function () {
    $("#formularioAgregarPago").submit(function (e) {
        e.preventDefault();
        const mes = $("#mesInput").val();
        const numeroMes = mes.split('-')[1];
        const nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)];
        const nombreFilaTabla = `data${nombreMes}`;

        const itemFila = $(`#${nombreFilaTabla}`).length;
        const tabla = $('#tabla');
        const elementostabla = parseInt(tabla.find('tr').length);

        const dataRequest = JSON.stringify(dataMesesHTML)
        const transformData = dataRequest.replace(/"/g, "'")

        const idAlumn = $(`#idAlumno`).val()

        ordenarArray(dataMesesHTML)
        console.log(dataMesesHTML)

        if (!idAlumn) {
            alert("no ha seleccionado ningun alumno para pagar")
            return false;
        }

        if (elementostabla > 0) {
            //e.preventDefault();
            $('#inputsHidden').html(`
                                <!-- todos los datos de manera oculta -->
                                <input type="hidden" name="dataTotal" id="dataTotal" value=${transformData}>
            `)
            return true;
        } else {
            if (elementostabla == 0) {
                //event.preventDefault();
                alert("no se ha agregado ningun mes a la lista para pagar por favor agrege un mes a la lista")
                return false;
            }
        }
    })
})




function ordenarArray(jsonData) {
    var numeroMesTemp
    var nombreMesTemp
    var precioMesTemp
    var pagoAlumnoTemp
    var saldoMesTemp
    var deudaTemp
    var saldoFavorTemp

    contador = 0

    dataMes.nombreMes.forEach(function (elemento1) {
        jsonData.nombreMes.forEach(function (elemento2, index) {

            if (elemento1 == elemento2) {

                //console.log(`se coloca en la posicion ${contador} al elemento: ${jsonData.nombreMes[index]}`)
                //console.log(`elemento existente en la posicion ${contador}: ${jsonData.nombreMes[contador]}`)

                //#: ordenamos el array de nombreMes
                nombreMesTemp = jsonData.nombreMes[contador]
                jsonData.nombreMes[contador] = jsonData.nombreMes[index]
                jsonData.nombreMes[index] = nombreMesTemp

                //#: ordenamos el array de numeroMes
                numeroMesTemp = jsonData.numeroMes[contador]
                jsonData.numeroMes[contador] = jsonData.numeroMes[index]
                jsonData.numeroMes[index] = numeroMesTemp

                //#: ordenamos el array de precioMes
                precioMesTemp = jsonData.precioMes[contador]
                jsonData.precioMes[contador] = jsonData.precioMes[index]
                jsonData.precioMes[index] = precioMesTemp

                //#: ordenamos el array de pagoAlumno
                pagoAlumnoTemp = jsonData.pagoAlumno[contador]
                jsonData.pagoAlumno[contador] = jsonData.pagoAlumno[index]
                jsonData.pagoAlumno[index] = pagoAlumnoTemp

                //#: ordenamos el array de saldoMes
                saldoMesTemp = jsonData.saldoMes[contador]
                jsonData.saldoMes[contador] = jsonData.saldoMes[index]
                jsonData.saldoMes[index] = saldoMesTemp

                //#: ordenamos el array de deuda
                deudaTemp = jsonData.deuda[contador]
                jsonData.deuda[contador] = jsonData.deuda[index]
                jsonData.deuda[index] = deudaTemp

                //#: ordenamos el array de saldoFavor
                saldoFavorTemp = jsonData.saldoFavor[contador]
                jsonData.saldoFavor[contador] = jsonData.saldoFavor[index]
                jsonData.saldoFavor[index] = saldoFavorTemp

                contador++

            }
        })
    })
}

