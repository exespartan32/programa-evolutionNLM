var dataMes = {
    nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
}

var dataMesesHTML = {
    numeroMes: [],
    nombreMes: [],
    precioMes: [],
    saldoMes: [],
}

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

function buscarDatosDB() {
    $(document).ready(function () {
        var mes = $("#mesInput").val()
        if (mes) {
            $.ajax({
                url: '/payment/loadPriceMonth/' + mes,
                success: function (data) {
                    var numeroMes = mes.split('-')[1]
                    var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]
                    var precioMes = data[0].precioMes

                    if (dataMesesHTML.numeroMes.length == 0) {
                        dataMesesHTML.numeroMes.push(mes)
                        dataMesesHTML.nombreMes.push(nombreMes)
                        dataMesesHTML.precioMes.push(precioMes)
                        dataMesesHTML.saldoMes.push(0)

                        var tabla = $('#tabla')

                        var tablaN = $(`#data${nombreMes}`).html()

                        if (!tablaN) {
                            tabla.append(`
                                <tr id="data${nombreMes}">
                                    <td class="table-info">${nombreMes}</td>
                                    <td class="table-info">${precioMes}$</td>
                                    <td class="table-info">
                                        <div class="input-group">
                                            <input class="form-control" type="number" id="pagoAlumno${nombreMes}" 
                                            style="width: 50px;" onchange="agregar_saldo_a_la_lista('${nombreMes}', ${precioMes})" required>
                                        </div>
                                    </td>
                                    <td class="table-info" id="saldo${nombreMes}" value=0></td>
                                    <td class="table-info">
                                        <button class="btn btn-outline-danger" type="button" onclick="eliminarPago('${nombreMes}')">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                                `)
                        }

                    } else {
                        const incluido = dataMesesHTML.numeroMes.includes(mes)
                        console.log(incluido)
                        if (incluido) {
                            console.log("el mes ya existe")
                        } else {
                            dataMesesHTML.numeroMes.push(mes)
                            dataMesesHTML.nombreMes.push(nombreMes)
                            dataMesesHTML.precioMes.push(precioMes)
                            dataMesesHTML.saldoMes.push(0)

                            var tabla = $('#tabla')

                            var tablaN = $(`#data${nombreMes}`).html()

                            if (!tablaN) {
                                tabla.append(`
                                    <tr id="data${nombreMes}">
                                        <td class="table-info">${nombreMes}</td>
                                        <td class="table-info">${precioMes} $</td>
                                        <td class="table-info">
                                            <div class="input-group">
                                                <input class="form-control" type="number" id="pagoAlumno${nombreMes}" 
                                                style="width: 50px;" onchange="agregar_saldo_a_la_lista('${nombreMes}', ${precioMes})" required>
                                            </div>
                                        </td>
                                        <td class="table-info" id="saldo${nombreMes}" value=0></td>
                                        <td class="table-info">
                                            <button class="btn btn-outline-danger" type="button" onclick="eliminarPago('${nombreMes}')">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    `)
                            }
                        }
                    }
                }
            })
        }
    })
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
    const pagoAlumno = $(`#pagoAlumno${nombreMes}`).val()

    const Index = dataMesesHTML.nombreMes.indexOf(nombreMes)
    const precioMes = dataMesesHTML.precioMes[Index]
    const saldo = parseInt(pagoAlumno) - parseInt(precioMes)

    dataMesesHTML.saldoMes[Index] = saldo


    const saldoMes = $(`#saldo${nombreMes}`)
    saldoMes.html(`${saldo} $`)
}

$(document).ready(function () {
    $("#formularioAgregarPago").submit(function (e) {
        //e.preventDefault();
        //alert("envio de formulario")

        const mes = $("#mesInput").val();
        const numeroMes = mes.split('-')[1];
        const nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)];
        const nombreFilaTabla = `data${nombreMes}`;

        //const itemFila = $(`#${nombreFilaTabla}`).length;
        const itemFila = $(`#${nombreFilaTabla}`).length;
        const tabla = $('#tabla');
        const elementostabla = parseInt(tabla.find('tr').length);

        const dataRequest = JSON.stringify(dataMesesHTML)
        const transformData = dataRequest.replace(/"/g, "'")

        const idAlumn = $(`#idAlumno`).val()

        if(!idAlumn){
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

