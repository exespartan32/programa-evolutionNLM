// % ----------------------------------------------------------------------------------------- %
// % ---------------------------------- variables globales ----------------------------------- %
// % ----------------------------------------------------------------------------------------- %
var dataMes = {
    nombreMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    numeroMes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    numeroAño: ['2023', '2024']
}

var deudaArray = {
    numeroMes: [],
    deuda: []
}

var dataMesesHTML = {
    idAlumno: "",
    numeroMes: [],
    nombreMes: [],
    precioMes: [],
    pagoAlumno: [],
    saldoMes: [],
    deuda: [],
    usoSaldoFavor: [],
    comentario: [],
    nombreMesSaldoFavor: [],
    numeroMesSaldoFavor: [],
    saldoFavorOriginal: [],
    saldoFavorUsado: [],
}
var dataArray = []
var saldoAcreedor = []
var ArrayMesesUsoSaldoFavor = []

var ArrayInputs = []


// % ----------------------------------------------------------------------------------------- %
// % ----------------------- cuando el usuario selecciona un alumno -------------------------- %
// % ----------------------------------------------------------------------------------------- %
$('#idAlumno').on('change', function () {
    saldoAcreedor = []
    $('#listaSaldoFavor').html('')
    $('#saldoFavorSelectMensaje').html('')
    $('#divSaldoActual').html('')
    $('#mensajeSaldoFavorRestante').html('')
    $('#saldoFavor').remove()


    $('#divSaldofavor').html(`
        <button id="botonSaldoFavor" class="btn btn-outline-dark" type="button" onclick="calcular_saldo_a_favor()">Calcular Saldo A Favor del alumno</button>
    `)

    //% primero que nada buscamos si tiene saldo a favor
    var idAlumno = $("#idAlumno").val()

    if (idAlumno != "") {
        dataMesesHTML.idAlumno = idAlumno
        for (let i = 0; i < dataMes.nombreMes.length; i++) {
            var numeroMesI = dataMes.numeroMes[i]
            for (let j = 0; j < dataMes.numeroAño.length; j++) {
                var numeroAñoI = dataMes.numeroAño[j]
                var mesNombreCompleto = `${numeroAñoI}-${numeroMesI}`
                var nombreMesN = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMesI)]

                var saldoTotal = 0

                $.ajax({
                    url: '/payment/loadSaldoFavorData/' + mesNombreCompleto + "/" + nombreMesN + "/" + idAlumno,
                    success: function (data) {
                        var numeroMesDB = data.numeroMes
                        var nombreMesDB = data.nombreMes
                        var saldoFavorDB = data.saldoFavor
                        var idAlumnoDB = data.idAlumno

                        if (numeroMesDB != "") {
                            if (data.saldoFavor != data.valorUsoSaldoFavor) { agregarSaldoFavorArray(data) }
                        }
                    }
                })
            }
        }
    }

    for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
        $(`#data${dataMesesHTML.nombreMes[i]}`).remove()
    }

    dataMesesHTML.numeroMes = []
    dataMesesHTML.nombreMes = []
    dataMesesHTML.precioMes = []
    dataMesesHTML.pagoAlumno = []
    dataMesesHTML.saldoMes = []
    dataMesesHTML.deuda = []
    dataMesesHTML.usoSaldoFavor = []
    dataMesesHTML.comentario = []
    dataMesesHTML.nombreMesSaldoFavor = []
    dataMesesHTML.numeroMesSaldoFavor = []
    dataMesesHTML.saldoFavorOriginal = []
    dataMesesHTML.saldoFavorUsado = []
})

// % ----------------------------------------------------------------------------------------- %
// % --------------------- cuando el usuario agrega un mes para pagar ------------------------ %
// % ----------------------------------------------------------------------------------------- %
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
                    var ultimoRegistro = data[1].at(-1)
                    var estadoPago = ultimoRegistro.Estado

                    if (estadoPago == "pago_parcial") {
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
// % ----------------------------------------------------------------------------------------- %
// % ---------------------- agregamos el mes seleccionado a la lista ------------------------- %
// % ----------------------------------------------------------------------------------------- %
function agregarTabla(deuda, favor, mes, nombreMes, precioMes) {
    //#: variables HTML
    const tabla = $('#tabla');
    const HeadTabla = $('#trTable');
    const elementostabla = parseInt(tabla.find('tr').length);
    var HeadDeudaTabla = $(`#HeadDeuda`)
    var BodyDeudaTabla = $(`#BodyDeuda${nombreMes}`)
    var SaldoFavorHTML = $(`#saldoFavor`)

    //#: si no ha sido guardado antes agregamos el mes seleccionado a la lista
    const busqueda = dataMesesHTML.nombreMes.includes(nombreMes)
    if (!busqueda) {
        //?: agregamos los datos al json para enviar al servidor
        dataMesesHTML.numeroMes.push(mes)
        dataMesesHTML.nombreMes.push(nombreMes)
        dataMesesHTML.precioMes.push(precioMes)
        dataMesesHTML.usoSaldoFavor.push(false)
        dataMesesHTML.saldoMes.push(0)
        dataMesesHTML.pagoAlumno.push(0)
        dataMesesHTML.comentario.push("-")
        dataMesesHTML.numeroMesSaldoFavor.push("-")

        //?: llenamos los datos por defecto para el saldo a favor
        dataMesesHTML.nombreMesSaldoFavor.push("-")
        dataMesesHTML.saldoFavorOriginal.push(0)
        dataMesesHTML.saldoFavorUsado.push(0)

        if (deuda > 0) {
            dataMesesHTML.deuda.push(deuda)
        } else {
            dataMesesHTML.deuda.push(0)
        }
        //?: agregamos el mes selecciodo a la lista
        if (SaldoFavorHTML.length > 0) {
            tabla.append(`
                    <tr id="data${nombreMes}">
                        <td class="table-info" id="contenedorNombreMes${nombreMes}">${nombreMes}</td>

                        <input type="hidden" id="numeroMes${nombreMes}" value="${mes}">

                        <td id="precio${nombreMes}" class="table-info" >${precioMes}$</td>

                        <td class="table-info" id="contenedorPago${nombreMes}">
                            <div class="input-group">
                                <input class="form-control" type="number" id="pagoAlumno${nombreMes}" 
                                style="width: 50px;" onchange="agregar_saldo_a_la_lista('${nombreMes}')" value=0 required>
                            </div>
                        </td>

                        <td class="table-info" id="saldo${nombreMes}" value=0></td>

                        <td class="table-info" id="contenedorEliminar${nombreMes}">
                            <button class="btn btn-outline-danger" type="button" onclick="eliminarPago('${nombreMes}')">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>

                        <td class="table-danger" id=BodyDeuda${nombreMes}>
                            <strong class="text-danger">${deuda} $</strong>
                            <input type="hidden" name="deuda${nombreMes}" id="deuda${nombreMes}" value=${deuda}>
                        </td>

                        <td class="table-info" id="contenedorComentario${nombreMes}">
                            <textarea class="form-control" id="comentario${nombreMes}" rows="1" required onchange="agregar_comentario_al_json('${nombreMes}')"></textarea>
                        </td>

                        <td class="table-info" id="dataSaldoFavor${nombreMes}">

                            <select class="form-select imput" id="listaMesesSaldofavor${nombreMes}" onchange="habilitar_input_saldo_favor('${nombreMes}')" required>
                                <option class="text-center" selected disabled>Mes</option>
                            </select>
                            
                            <input type="number" id="inputUsoSaldoFavor${nombreMes}" class="form-control" onchange="calcular_uso_saldo_favor('${nombreMes}')" disabled required>
                            <input type="hidden" id="saldoFavorActual${nombreMes}" value="">
                        
                        </td>
                    </tr>
                `)

            for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
                for (let j = 0; j < saldoAcreedor.length; j++) {
                    var saldoFavorHTML = $(`#optionSaldoFavor${saldoAcreedor[j].nombreMes}_Fila${dataMesesHTML.nombreMes[i]}`)
                    if (saldoAcreedor[j].usaSaldoFavor == false) {
                        saldoFavorHTML.remove()
                    }
                    if (saldoAcreedor[j].usaSaldoFavor == true && saldoFavorHTML.length == 0) {
                        $(`#listaMesesSaldofavor${dataMesesHTML.nombreMes[i]}`).append(`
                                    <option value="${saldoAcreedor[j].nombreMes}" id="optionSaldoFavor${saldoAcreedor[j].nombreMes}_Fila${dataMesesHTML.nombreMes[i]}" >${saldoAcreedor[j].nombreMes}</option>
                        `)

                        var mensajeSaldoFavorActual = $(`#mensajeSaldoFavorRestante`)
                        var mensajeMes = $(`#saldoFavorActualMensaje${saldoAcreedor[j].nombreMes}`)
                        var saldoActual = saldoAcreedor[j].saldoFavor - saldoAcreedor[j].valorUsoSaldoFavor


                        if (mensajeMes.length == 0) {
                            mensajeSaldoFavorActual.append(`
                                <center id="saldoFavorActualMensaje${saldoAcreedor[j].nombreMes}">
                                    <strong>el saldo a favor disponible del mes de ${saldoAcreedor[j].nombreMes} es de </strong>
                                    <strong id="mensajeValorSaldofavorActual${saldoAcreedor[j].nombreMes}">${saldoActual} $</strong>
                                </center>
                            `)
                        }

                        if ($(`#saldoFavorDisponible${saldoAcreedor[j].nombreMes}`).length == 0) {
                            $(`#divSaldoActual`).append(`
                                <input type="hidden" id="saldoFavorDisponible${saldoAcreedor[j].nombreMes}" value="${saldoActual}">
                            `)
                        }
                    }
                }
            }
        } else {
            tabla.append(`
                    <tr id="data${nombreMes}">
                        <td class="table-info" id="contenedorNombreMes${nombreMes}">${nombreMes}</td>
                            
                        <input type="hidden" id="numeroMes${nombreMes}" value="${mes}">

                        <td id="precio${nombreMes}" class="table-info" >${precioMes}$</td>

                        <td class="table-info" id="contenedorPago${nombreMes}">
                            <div class="input-group">
                                <input class="form-control" type="number" id="pagoAlumno${nombreMes}" 
                                style="width: 50px;" onchange="agregar_saldo_a_la_lista('${nombreMes}')" value=0 required>
                            </div>
                        </td>

                        <td class="table-info" id="saldo${nombreMes}" value=0></td>

                        <td class="table-info" id="contenedorEliminar${nombreMes}">
                            <button class="btn btn-outline-danger" type="button" onclick="eliminarPago('${nombreMes}')">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>

                        <td class="table-danger" id=BodyDeuda${nombreMes}>
                            <strong class="text-danger">${deuda} $</strong>
                            <input type="hidden" name="deuda${nombreMes}" id="deuda${nombreMes}" value=${deuda}>
                        </td>

                        <td class="table-info" id="contenedorComentario${nombreMes}">
                            <textarea class="form-control" id="comentario${nombreMes}" rows="1" required onchange="agregar_comentario_al_json('${nombreMes}')"></textarea>
                        </td>
                    </tr>
            `)
        }

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

// % ----------------------------------------------------------------------------------------- %
// % -------------------- validamos que el mes seleccionado tena precio ---------------------- %
// % ----------------------------------------------------------------------------------------- %
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

// % ----------------------------------------------------------------------------------------- %
// % ------------------------- agregamos los comentarios al json ----------------------------- %
// % -------------------------- que envia los datos al servidor ------------------------------ %
// % ----------------------------------------------------------------------------------------- %
function agregar_comentario_al_json(nombreMes) {
    var comentario = $(`#comentario${nombreMes}`).val()
    const Index = dataMesesHTML.nombreMes.indexOf(nombreMes)
    if (comentario != "") dataMesesHTML.comentario[Index] = comentario
}

// % ----------------------------------------------------------------------------------------- %
// % -------------------- calculamos el saldo a favor que posee el alumno -------------------- %
// % ------------------------- y luego se lo mostramos al usuario ---------------------------- %
// % ----------------------------------------------------------------------------------------- %
function calcular_saldo_a_favor() {
    var idAlumno = $("#idAlumno").val()
    if (idAlumno == null) {
        alert("primero debe seleccionar un alumno")
    } else {
        $.ajax({
            url: '/payment/loadDataAlumn/' + idAlumno,
            success: function (data) {
                var nombreAlumno = `${data.nombre} ${data.apellido}`
                var contador = 0
                var saldofavor = 0

                for (let i = 0; i < saldoAcreedor.length; i++) {

                    if (saldoAcreedor[i].idAlumno == idAlumno) {
                        contador++

                        saldofavor += saldoAcreedor[i].saldoFavor
                        var mensajeSaldoFavor = $(`#mensajeSaldoFavor`)
                        var listaSaldoFavor = $(`#listaSaldoFavor`)
                        var saldoFavorMes = $(`#elementoListaSaldoFavor${saldoAcreedor[i].nombreMes}`)
                        var checkboxMes = $(`#checkbox${saldoAcreedor[i].nombreMes}`)

                        if (mensajeSaldoFavor.html() == "") {
                            mensajeSaldoFavor.html(`
                                <center id="saldoFavorSelectMensaje">
                                    <strong>selecciona el saldo a favor que desea usar para pagar</strong>
                                </center>
                            `)
                        }

                        if (saldoFavorMes.length == 0) {

                            var saldoActual = saldoAcreedor[i].saldoFavor - saldoAcreedor[i].valorUsoSaldoFavor

                            listaSaldoFavor.append(`
                                <li class="list-group-item" id="elementoListaSaldoFavor${saldoAcreedor[i].nombreMes}">
                                    <input class="form-check-input me-1" type="checkbox" value="" id="checkbox${saldoAcreedor[i].nombreMes}" onchange="cambiar_uso_saldo_favor('${saldoAcreedor[i].nombreMes}')">
                                    <label class="form-check-label" for="checkbox${saldoAcreedor[i].nombreMes}">
                                        <strong>${saldoActual}</strong>
                                    </label>
                                    <span class="badge bg-primary rounded-pill">${saldoAcreedor[i].nombreMes}</span>
                                    <input type="hidden" id="SaldoFavor${saldoAcreedor[i].nombreMes}" value=${saldoActual}>
                                </li>
                            `)
                        }

                        $('#divSaldofavor').html(`
                            <div class="d-grid gap-2 col-6 mx-auto">
                                <button class="btn btn-primary" type="button" id="usarSaldofavor" onclick="agregarSaldoFavor()">usar el saldo a favor seleccionado</button>
                            </div>
                        `)
                    }
                }
                if (contador == 0) {
                    alert("el alumno seleccionado no tiene saldo a favor")
                    //$('#saldoFavorSelectMensaje').html("")
                    //$(`#listaSaldoFavor`).html("")
                }
            }
        })
    }
}

function cambiar_uso_saldo_favor(nombreMes) {
    $(document).ready(function () {
        var saldoFavorMes = $(`#SaldoFavor${nombreMes}`).val()
        var checkMes = $(`#checkbox${nombreMes}`).prop('checked')

        for (let i = 0; i < saldoAcreedor.length; i++) {
            if (saldoAcreedor[i].nombreMes == nombreMes) {
                saldoAcreedor[i].usaSaldoFavor = checkMes
            }
        }
    })
}


// % ----------------------------------------------------------------------------------------- %
// % ----------------------------- agregamos un input para usar ------------------------------ %
// % ----------------------- el saldo a favor disponible para pagar -------------------------- %
// % ----------------------------------------------------------------------------------------- %
function agregarSaldoFavor() {
    $(document).ready(function () {
        //#: datos del HTML 
        const HeadTabla = $('#trTable');
        const BodyTabla = $('#tabla');
        const saldoFavor = $('#saldoFavor');
        const saldoFavorHeadHTML = $('#saldoFavor')

        //#: otros datos 
        var idAlumno = $("#idAlumno").val()
        var valorSaldoFavor = $(`#Saldofavor_${idAlumno}`).val()
        var nombresMeses = dataMesesHTML.nombreMes

        if (saldoFavorHeadHTML.length == 0) {
            if (saldoFavor.length == 0) {
                HeadTabla.append(`
                    <th id="saldoFavor">Usar saldo a favor para pagar</th>        
                `)

                for (let i = 0; i < nombresMeses.length; i++) {
                    $(`#data${nombresMeses[i]}`).append(`
                        <td class="table-info" id="dataSaldoFavor${nombresMeses[i]}">

                            <select class="form-select imput" id="listaMesesSaldofavor${nombresMeses[i]}" onchange="habilitar_input_saldo_favor('${nombresMeses[i]}')" required>
                                <option class="text-center" selected disabled>Mes</option>
                            </select>
                            
                            <input type="number" id="inputUsoSaldoFavor${nombresMeses[i]}" class="form-control" onchange="calcular_uso_saldo_favor('${nombresMeses[i]}')" disabled required>
                            <input type="hidden" id="saldoFavorActual${nombresMeses[i]}" value="">
                        
                        </td>
                    `)
                }
            }
        }

        for (let i = 0; i < nombresMeses.length; i++) {
            dataArray.push({ fila: nombresMeses[i], mesesSaldoFavor: [] })
        }

        for (let i = 0; i < dataArray.length; i++) {
            for (let j = 0; j < saldoAcreedor.length; j++) {
                dataArray[i].mesesSaldoFavor.push(saldoAcreedor[j])
            }
        }

        for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
            for (let j = 0; j < saldoAcreedor.length; j++) {

                var saldoFavorHTML = $(`#optionSaldoFavor${saldoAcreedor[j].nombreMes}_Fila${dataMesesHTML.nombreMes[i]}`)

                if (saldoAcreedor[j].usaSaldoFavor == false) {
                    saldoFavorHTML.remove()
                }

                if (saldoAcreedor[j].usaSaldoFavor == true && saldoFavorHTML.length == 0) {
                    var saldoActual = saldoAcreedor[j].saldoFavor - saldoAcreedor[j].valorUsoSaldoFavor

                    $(`#listaMesesSaldofavor${dataMesesHTML.nombreMes[i]}`).append(`
                                <option value="${saldoAcreedor[j].nombreMes}" id="optionSaldoFavor${saldoAcreedor[j].nombreMes}_Fila${dataMesesHTML.nombreMes[i]}" >${saldoAcreedor[j].nombreMes}</option>
                    `)

                    if ($(`#saldoFavorDisponible${saldoAcreedor[j].nombreMes}`).length == 0) {
                        $(`#divSaldoActual`).append(`
                            <input type="hidden" id="saldoFavorDisponible${saldoAcreedor[j].nombreMes}" value="${saldoActual}">
                        `)
                    }

                    var mensajeSaldoFavorActual = $(`#mensajeSaldoFavorRestante`)
                    var mensajeMes = $(`#saldoFavorActualMensaje${saldoAcreedor[j].nombreMes}`)


                    if (mensajeMes.length == 0) {
                        mensajeSaldoFavorActual.append(`
                            <center id="saldoFavorActualMensaje${saldoAcreedor[j].nombreMes}">
                                <strong>el saldo a favor disponible del mes de ${saldoAcreedor[j].nombreMes} es de </strong>
                                <strong id="mensajeValorSaldofavorActual${saldoAcreedor[j].nombreMes}">${saldoActual} $</strong>
                            </center>
                        `)
                    }
                }
            }
        }
    })
}

// % ----------------------------------------------------------------------------------------- %
// % -------- cuando el usauario seleccione el mes del que hara uso del saldo a favor -------- %
// % --------------- habilitamos para que coloque el saldo a favor que usara  ---------------- %
// % ----------------------------------------------------------------------------------------- %
function habilitar_input_saldo_favor(nombreMesFila) {
    $(document).ready(function () {
        var nombreMesSaldoFavorSeleccionado = $(`#listaMesesSaldofavor${nombreMesFila}`).val()
        var usoSaldoFavorHTML = $(`#inputUsoSaldoFavor${nombreMesFila}`)
        usoSaldoFavorHTML.prop('disabled', false);
        usoSaldoFavorHTML.val('')
        const Index = dataMesesHTML.nombreMes.indexOf(nombreMesFila)
        dataMesesHTML.nombreMesSaldoFavor[Index] = "-"
        dataMesesHTML.usoSaldoFavor[Index] = false

        if (nombreMesSaldoFavorSeleccionado != undefined && nombreMesSaldoFavorSeleccionado != "") {
            dataMesesHTML.nombreMesSaldoFavor[Index] = nombreMesSaldoFavorSeleccionado
            dataMesesHTML.usoSaldoFavor[Index] = true

            for (let i = 0; i < saldoAcreedor.length; i++) {
                if (saldoAcreedor[i].nombreMes == nombreMesSaldoFavorSeleccionado) {
                    dataMesesHTML.saldoFavorOriginal[Index] = saldoAcreedor[i].saldoFavor
                    dataMesesHTML.numeroMesSaldoFavor[Index] = saldoAcreedor[i].numeroMes
                }
            }
        }
    })
}

// % ----------------------------------------------------------------------------------------- %
// % ------------------- cuando el usuario usa el saldo a favor para pagar ------------------- %
// % ------------ hacemos los calculos para obtener el el saldo a favor restante ------------- %
// % ----------------------------------------------------------------------------------------- %

function calcular_uso_saldo_favor(nombreMesFila) {
    var usoSaldoFavorHTML = $(`#inputUsoSaldoFavor${nombreMesFila}`)
    var valorUsoSaldoFavor = parseInt(usoSaldoFavorHTML.val())
    var nombreMesSaldoFavorSeleccionado = $(`#listaMesesSaldofavor${nombreMesFila}`).val()
    var hiddenSaldoFavorActual = $(`#saldoFavorActual${nombreMesFila}`)
    hiddenSaldoFavorActual.val(0)

    //#: 1) recorremos los elementos de la tabla
    for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
        //#: 2) el elemento es igual a la fila en la que estamos trabajando
        if (dataMesesHTML.nombreMes[i] == nombreMesFila) {
            //#: 3) recorremos el array de saldo a favor
            for (let j = 0; j < saldoAcreedor.length; j++) {
                //#: 4) el elemento es igual al mes del saldo a favor seleccionado en la fila
                if (saldoAcreedor[j].nombreMes == nombreMesSaldoFavorSeleccionado) {
                    var saldo = saldoAcreedor[j].saldoFavor - saldoAcreedor[j].valorUsoSaldoFavor

                    //#: 6) el saldo a favor usado es mayor al saldo a favor total disponible
                    if (valorUsoSaldoFavor > saldo) {
                        alert(`el mes de ${saldoAcreedor[i].nombreMes} tiene un saldo a favor disponible de ${saldo}. No puede colocar un numero mayor a ese saldo`)
                        usoSaldoFavorHTML.val("")
                        if (saldo == 0) {
                            usoSaldoFavorHTML.val(dataMesesHTML.saldoFavorUsado[i])
                        }
                    } else {
                        dataMesesHTML.saldoFavorOriginal[i] = parseInt($(`#saldoFavorDisponible${saldoAcreedor[j].nombreMes}`).val())
                        dataMesesHTML.saldoFavorUsado[i] = valorUsoSaldoFavor
                        saldoAcreedor[j].valorUsoSaldoFavor = valorUsoSaldoFavor + saldoAcreedor[j].valorUsoSaldoFavor
                    }
                }
            }
        }
    }
}

// % ----------------------------------------------------------------------------------------- %
// % ------------------- agregamos el saldo a favor disponible en un array ------------------- %
// % ------------------- para poder validar los datos y hacer los calculos ------------------- %
// % ----------------------------------------------------------------------------------------- %
function agregarSaldoFavorArray(data) {
    saldoAcreedor.push(data)
    let setAcreedor = new Set(saldoAcreedor.map(JSON.stringify))
    let arrSinDuplicaciones = Array.from(setAcreedor).map(JSON.parse);
    saldoAcreedor = []
    saldoAcreedor = arrSinDuplicaciones

    console.log(saldoAcreedor)
}

// % ----------------------------------------------------------------------------------------- %
// % ------------------- cuando el usuario elimina un es de la lista ------------------------- %
// % --------------------------- borramos el mes de la lista y ------------------------------- %
// % -------------------- borramos los datos guardados en los arrays ------------------------- %
// % ----------------------------------------------------------------------------------------- %
function eliminarPago(nombreMes) {
    const index = dataMesesHTML.nombreMes.indexOf(nombreMes)

    dataMesesHTML.numeroMes.splice(index, 1)
    dataMesesHTML.nombreMes.splice(index, 1)
    dataMesesHTML.precioMes.splice(index, 1)
    dataMesesHTML.pagoAlumno.splice(index, 1)
    dataMesesHTML.saldoMes.splice(index, 1)
    dataMesesHTML.deuda.splice(index, 1)
    dataMesesHTML.saldoFavor.splice(index, 1)
    dataMesesHTML.usoSaldoFavor.splice(index, 1)
    dataMesesHTML.comentario.splice(index, 1)
    dataMesesHTML.nombreMesSaldoFavor.splice(index, 1)
    dataMesesHTML.numeroMesSaldoFavor.splice(index, 1)
    dataMesesHTML.saldoFavorOriginal.splice(index, 1)
    dataMesesHTML.saldoFavorUsado.splice(index, 1)

    $(`#data${nombreMes}`).remove()
}

// % ----------------------------------------------------------------------------------------- %
// % ------------------------- cuando el usuario realiza un pago ----------------------------- %
// % ---------------------- realizamos los calculos correspondientes ------------------------- %
// % ----------------------------------------------------------------------------------------- %
function agregar_saldo_a_la_lista(nombreMes) {
    $(document).ready(function () {
        const pagoAlumno = $(`#pagoAlumno${nombreMes}`).val()
        const Index = dataMesesHTML.nombreMes.indexOf(nombreMes)
        const precioMes = dataMesesHTML.precioMes[Index]
        const deuda = $(`#deuda${nombreMes}`).val()
        const usaSaldoFavorHTML = $(`#inputUsoSaldoFavor${nombreMes}`).val()
        var saldo = 0

        if (usaSaldoFavorHTML != undefined && usaSaldoFavorHTML != "") {
            if (deuda > 0) {
                saldo = parseInt(pagoAlumno) + parseInt(usaSaldoFavorHTML) - parseInt(deuda)
            } else {
                saldo = parseInt(pagoAlumno) + parseInt(usaSaldoFavorHTML) - parseInt(precioMes)
            }
        } else {
            if (deuda > 0) {
                saldo = parseInt(pagoAlumno) - parseInt(deuda)
            } else {
                saldo = parseInt(pagoAlumno) - parseInt(precioMes)
            }
        }

        dataMesesHTML.saldoMes[Index] = saldo
        dataMesesHTML.pagoAlumno[Index] = parseInt(pagoAlumno)

        const saldoMes = $(`#saldo${nombreMes}`)
        saldoMes.html(`${saldo} $`)
        saldoMes.val(saldo)

    })
}

// % ----------------------------------------------------------------------------------------- %
// % ------------------ cuando se envia el formulario lleno con los datos -------------------- %
// % ----------------- guardamos los datos que seran enviados al servidor -------------------- %
// % ------------------------------ en un input tipo hiiden ---------------------------------- %
// % ----------------------------------------------------------------------------------------- %
$(document).ready(function () {
    $("#formularioAgregarPago").submit(function (e) {
        //e.preventDefault();
        const mes = $("#mesInput").val();
        const numeroMes = mes.split('-')[1];
        const nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)];
        const nombreFilaTabla = `data${nombreMes}`;

        const itemFila = $(`#${nombreFilaTabla}`).length;
        const tabla = $('#tabla');
        const elementostabla = parseInt(tabla.find('tr').length);

        const dataRequest = JSON.stringify(dataMesesHTML)
        const transformData = dataRequest.replace(/"/g, "'")
        var dataString = `"${transformData}"`

        const idAlumn = $(`#idAlumno`).val()

        ordenarArray(dataMesesHTML)
        //console.log("dataMesesHTML")
        //console.log(dataMesesHTML)

        if (!idAlumn) {
            alert("no ha seleccionado ningun alumno para pagar")
            return false;
        }

        if (elementostabla > 0) {
            $('#inputsHidden').html(`
                                <!-- todos los datos de manera oculta -->
                                <input type="hidden" name="dataTotal" id="dataTotal" value=${dataString}>
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

// % ----------------------------------------------------------------------------------------- %
// % ----------------- ordenamos los datos siguiendo el orden de los meses ------------------- %
// % ----------------------------------------------------------------------------------------- %
function ordenarArray(jsonData) {
    var numeroMesTemp
    var nombreMesTemp
    var precioMesTemp
    var pagoAlumnoTemp
    var saldoMesTemp
    var deudaTemp
    var saldoFavorTemp
    var comentariotemp
    var nombreMesSaldoFavortemp
    var saldoFavorOriginalTemp
    var saldoFavorUsadoTemp
    var numeroMesSaldoFavorTemp


    contador = 0

    dataMes.nombreMes.forEach(function (elemento1) {
        jsonData.nombreMes.forEach(function (elemento2, index) {
            if (elemento1 == elemento2) {
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
                saldoFavorTemp = jsonData.usoSaldoFavor[contador]
                jsonData.usoSaldoFavor[contador] = jsonData.usoSaldoFavor[index]
                jsonData.usoSaldoFavor[index] = saldoFavorTemp

                //#: ordenamos el array de comentarios
                comentariotemp = jsonData.comentario[contador]
                jsonData.comentario[contador] = jsonData.comentario[index]
                jsonData.comentario[index] = comentariotemp

                //#: ordenamos el array de los nombre de los meses de los saldo a favor
                nombreMesSaldoFavortemp = jsonData.nombreMesSaldoFavor[contador]
                jsonData.nombreMesSaldoFavor[contador] = jsonData.nombreMesSaldoFavor[index]
                jsonData.nombreMesSaldoFavor[index] = nombreMesSaldoFavortemp

                //#: ordenamos el array de los saldo a favor maximos disponibles
                saldoFavorOriginalTemp = jsonData.saldoFavorOriginal[contador]
                jsonData.saldoFavorOriginal[contador] = jsonData.saldoFavorOriginal[index]
                jsonData.saldoFavorOriginal[index] = saldoFavorOriginalTemp

                //#: ordenamos el array del uso de los saldos a favor
                saldoFavorUsadoTemp = jsonData.saldoFavorUsado[contador]
                jsonData.saldoFavorUsado[contador] = jsonData.saldoFavorUsado[index]
                jsonData.saldoFavorUsado[index] = saldoFavorUsadoTemp

                //#: ordenamos el array del uso de los numeros de los saldo a favor
                numeroMesSaldoFavorTemp = jsonData.numeroMesSaldoFavor[contador]
                jsonData.numeroMesSaldoFavor[contador] = jsonData.numeroMesSaldoFavor[index]
                jsonData.numeroMesSaldoFavor[index] = numeroMesSaldoFavorTemp

                contador++
            }
        })
    })
}