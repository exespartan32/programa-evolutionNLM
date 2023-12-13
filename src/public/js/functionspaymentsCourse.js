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
    numeroMes: [],
    nombreMes: [],
    precioMes: [],
    pagoAlumno: [],
    saldoMes: [],
    deuda: [],
    usoSaldoFavor: [],
    comentario: [],
}
var mesesDeudores = []

var saldoAcreedor = []
var nuevoArraySaldofavor = []

var dataSaldoFavor = {
    numeroMes: [],
    nombreMes: [],
    saldoFavorOriginal: [],
    saldoFavorUsado: [],
}

// % ----------------------------------------------------------------------------------------- %
// % ----------------------- cuando el usuario selecciona un alumno -------------------------- %
// % ----------------------------------------------------------------------------------------- %
$('#idAlumno').on('change', function () {
    $('#saldoFavorTotal').html("")
    $('#saldoFavor').remove()

    for (let i = 0; i < dataMesesHTML.numeroMes.length; i++) {
        console.log($(`#data${dataMesesHTML.nombreMes[i]}`))
    }

    $('#divSaldofavor').html(`
        <button id="botonSaldoFavor" class="btn btn-outline-dark" type="button" onclick="calcular_saldo_a_favor()">Calcular Saldo A Favor del alumno</button>
    `)

    var saldoFavorHTML = $('#hiddenSaldoFavor')
    var mes = $("#mesInput").val()

    const tabla = $('#tabla');
    const elementostabla = parseInt(tabla.find('tr').length);

    var idAlumno = $("#idAlumno").val()
    var nombreAlumno = $("#idAlumno").html()

    var numeroMes = mes.split('-')[1]
    var nombreMes = dataMes.nombreMes[dataMes.numeroMes.indexOf(numeroMes)]

    var acreedorN = []
    var Arraydata = []
    var saldoFavorHTL = $("#hiddenSaldoFavor")

    var existenciaSaldofavor = 0

    //% primero que nada buscamos si tiene saldo a favor
    var idAlumno = $("#idAlumno").val()
    if (idAlumno != "") {
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
                            agregarSaldoFavorArray(data)
                        }
                    }
                })
            }
        }
    } /**/

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
                        const itemPagoAlumno = $(`#pagoAlumno${itemI}`)
                        const pagoAlumno = itemPagoAlumno.val()
                        const Index = dataMesesHTML.nombreMes.indexOf(itemI)

                        if (pagoAlumno != "") {
                            itemPagoAlumno.val("")
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
                    } else {

                        var ultimoRegistro = DataMovAcc.at(-1)
                        var estadoPagoUltimo = ultimoRegistro.Estado

                        if (estadoPagoUltimo == "pago_parcial") {
                            //#: seteamos los valores de las deudas por los que tiene el nuevo alumno
                            ArrayDeudaMes[i] = deuda
                            const itemPagoAlumno = $(`#pagoAlumno${itemI}`)
                            const pagoAlumno = itemPagoAlumno.val()
                            const Index = dataMesesHTML.nombreMes.indexOf(itemI)

                            if (pagoAlumno != "") {
                                itemPagoAlumno.val("")
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
                            const Index = dataMesesHTML.nombreMes.indexOf(itemI)
                            //alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad`)
                            if (estadoPagoUltimo == "saldo_a_favor") {
                                //console.log(`el mes de ${itemI} ya ha sido pagado en su totalidad y tiene ${favor}$ de saldo a favor`)
                                tablaBodyHTML.remove()
                                ArrayNumeroMeses.splice(Index, 1)
                                ArrayNombreMeses.splice(Index, 1)
                                ArrayPrecioMes.splice(Index, 1)
                                ArraySaldoMes.splice(Index, 1)
                                ArrayDeudaMes.splice(Index, 1)
                                ArrayPagoAlumno.splice(Index, 1)
                                ArraySaldoFavor.splice(Index, 1)
                                //console.log(ArrayNombreMeses)
                            }
                            if (estadoPagoUltimo == "pago_total") {
                                //console.log(`el mes de ${itemI} ya ha sido pagado en su totalidad`)
                                tablaBodyHTML.remove()
                                ArrayNumeroMeses.splice(Index, 1)
                                ArrayNombreMeses.splice(Index, 1)
                                ArrayPrecioMes.splice(Index, 1)
                                ArraySaldoMes.splice(Index, 1)
                                ArrayDeudaMes.splice(Index, 1)
                                ArrayPagoAlumno.splice(Index, 1)
                                ArraySaldoFavor.splice(Index, 1)
                            }
                        }
                    }
                }
            })
        })
    }
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

                var saldoFavor = 0
                var saldofavorHTML = $(`#saldoFavor`)
                var saldofavorTablaHTML = $(`#Saldofavor_${idAlumno}`).val()

                if (saldofavorTablaHTML != undefined) {
                    saldoFavor = saldofavorTablaHTML
                }


                if (data[1].length > 0) {
                    //console.log("mes ya pagado con anteridad")
                    var ultimoRegistro = data[1].at(-1)
                    var estadoPago = ultimoRegistro.Estado

                    if (estadoPago == "pago_parcial") {
                        //console.log("agregar a la lista con la deuda que aun tiene")
                        agregarTabla(deuda, favor, mes, nombreMes, precioMes, saldoFavor)
                    }
                    else {
                        //alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad`)
                        if (estadoPago == "saldo_a_favor") { alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad y tiene ${favor}$ de saldo a favor`) }
                        if (estadoPago == "pago_total") { alert(`el mes de ${nombreMes} ya ha sido pagado en su totalidad`) }
                    }

                } else {
                    agregarTabla(deuda, favor, mes, nombreMes, precioMes, saldoFavor)
                }
            }
        })
    }
})
// % ----------------------------------------------------------------------------------------- %
// % ---------------------- agregamos el mes seleccionado a la lista ------------------------- %
// % ----------------------------------------------------------------------------------------- %
function agregarTabla(deuda, favor, mes, nombreMes, precioMes, saldoFavor) {
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
        dataMesesHTML.usoSaldoFavor.push(false)
        dataMesesHTML.saldoMes.push("-")
        dataMesesHTML.pagoAlumno.push(0)
        dataMesesHTML.comentario.push("-")
        if (deuda > 0) {
            dataMesesHTML.deuda.push(deuda)
        } else {
            dataMesesHTML.deuda.push(0)
        }

        //?: agregamos el mes selecciodo a la lista
        if (saldoFavor > 0) {

            var idAlumno = $("#idAlumno").val()
            const saldoFavorActual = $(`#SaldofavorActual_${idAlumno}`).val()

            //console.log(`saldo a favor actual: ${saldoFavorActual}`)

            if (saldoFavorActual == 0) {
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
                        <td class="table-info">
                            <textarea class="form-control" id="comentario${nombreMes}" rows="1" required onchange="agregar_comentario_al_json('${nombreMes}')"></textarea>
                        </td>
                        <td class="table-info" id="dataSaldoFavor${nombreMes}">
                            <div class="input-group">
                                <input type="number" min="0" max="${saldoFavor}" class="form-control" id="valorUsoSaldoFavor${nombreMes}" onchange="usarSaldoFavor('${nombreMes}')" disabled>
                            </div>
                        </td>
                    </tr>
                `)
            }else{
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
                        <td class="table-info">
                            <textarea class="form-control" id="comentario${nombreMes}" rows="1" required onchange="agregar_comentario_al_json('${nombreMes}')"></textarea>
                        </td>
                        <td class="table-info" id="dataSaldoFavor${nombreMes}">
                            <div class="input-group">
                                <input type="number" min="0" max="${saldoFavor}" class="form-control" id="valorUsoSaldoFavor${nombreMes}" onchange="usarSaldoFavor('${nombreMes}')">
                            </div>
                        </td>
                    </tr>
                `)
            }


        } else {
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
                        <td class="table-info">
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
function agregar_comentario_al_json(nombreMes){
    var comentario = $(`#comentario${nombreMes}`).val()
    const Index = dataMesesHTML.nombreMes.indexOf(nombreMes)
    if(comentario != "") dataMesesHTML.comentario[Index] = comentario
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

                console.log("")
                console.log("-------------------------------------------------")
                console.log("-------------------------------------------------")
                for (let i = 0; i < saldoAcreedor.length; i++) {
                    if (saldoAcreedor[i].idAlumno == idAlumno) {
                        contador++
                        saldofavor += saldoAcreedor[i].saldoFavor
                        console.log("datos del saldo a favor")
                        console.log(saldoAcreedor[i])
                    }
                }
                console.log("-------------------------------------------------")
                console.log("-------------------------------------------------")
                console.log("")



                if (saldofavor > 0) {
                    $('#saldoFavorTotal').html(`
                    <div class="position-relative py-2 px-4 text-bg-secondary border border-secondary rounded-pill">
                        <strong id="saldoFavorAlumno">El saldo a favor del alumno: ${nombreAlumno} es de ${saldofavor} $</strong> <svg width="1em" height="1em" viewBox="0 0 16 16"
                            class="position-absolute top-100 start-50 translate-middle mt-1"
                            fill="var(--bs-secondary)" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                        </svg>
                    </div>

                    <input type="hidden" id="Saldofavor_${idAlumno}" value=${saldofavor}>
                `)

                    $('#divSaldofavor').html(`
                    <div class="d-grid gap-2 col-6 mx-auto">
                        <button class="btn btn-primary" type="button" id="usarSaldofavor" onclick="agregarSaldoFavor()">usar saldo a favor</button>
                    </div>
                `)
                }

                if (contador == 0) {
                    alert("el alumno seleccionado no tiene saldo a favor")
                    $('#saldoFavorTotal').html("")
                }
            }
        })
    }
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
                        <div class="input-group">
                            <input type="number" min="0" max="${valorSaldoFavor}" class="form-control" id="valorUsoSaldoFavor${nombresMeses[i]}" onchange="usarSaldoFavor('${nombresMeses[i]}')">
                        </div>
                    </td>
                `)
                }
            } else {
                for (let i = 0; i < nombresMeses.length; i++) {
                    $(`#data${nombresMeses[i]}`).append(`
                    <td class="table-info" id="dataSaldoFavor${nombresMeses[i]}">
                        <div class="input-group">
                            <input type="number" min="0" max="${valorSaldoFavor}" class="form-control" id="valorUsoSaldoFavor${nombresMeses[i]}" onchange="usarSaldoFavor('${nombresMeses[i]}')">
                        </div>
                    </td>
                `)
                }
            }
        }
        $('#usarSaldofavor').remove()
    })

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
}

// % ----------------------------------------------------------------------------------------- %
// % ------------------- cuando el usuario usa el saldo a favor para pagar ------------------- %
// % ---------------------- hacemos los calculos para obtener el saldo ----------------------- %
// % ----------------------------------------------------------------------------------------- %
function usarSaldoFavor(nombreMes) {
    $(document).ready(function () {
        //#: datos del id alumno
        const idAlumno = $("#idAlumno").val()

        //#: datos del saldo a favor
        const saldofavorHiddenHTML = parseInt($(`#Saldofavor_${idAlumno}`).val())
        const usaSaldoFavorHTML = $(`#valorUsoSaldoFavor${nombreMes}`)
        const usaSaldoFavor = parseInt(usaSaldoFavorHTML.val())
        const saldoFavorAlumnoMensaje = $(`#saldoFavorAlumno`)
        const divSaldoFavorTotal = $(`#saldoFavorTotal`)
        const hiddenSaldoFavorActual = $(`#SaldofavorActual_${idAlumno}`)

        //#: datos del pago del alumno
        const pagoAlumno = $(`#pagoAlumno${nombreMes}`).val()

        //#: datos de la deuda del alumno
        const BodyDeudaHTML = $(`#BodyDeuda${nombreMes}`)
        const deudaMes = $(`#deuda${nombreMes}`).val()

        //#: datos del saldo y precio del mes seleccionadd
        const saldoMes = $(`#saldo${nombreMes}`)
        const Index = dataMesesHTML.nombreMes.indexOf(nombreMes)
        const precioMes = dataMesesHTML.precioMes[Index]
        
        var saldoTotal = 0
        var saldoFavorActual = 0
        var saldoActual = 0

        console.log(`usaSaldoFavorHTML.val(): ${usaSaldoFavorHTML.val()}`)

        if(usaSaldoFavorHTML.val() != ""){
            dataMesesHTML.usoSaldoFavor[Index] = true
        }else{
            dataMesesHTML.usoSaldoFavor[Index] = false
        }

        if (usaSaldoFavor > saldofavorHiddenHTML) {
            alert("no puede colocar un valor mayor al saldo a favor disponible para usar")
            usaSaldoFavorHTML.val("")
        } else {
            //?: 1) sumamos todo el saldo a favor usado en cada fila
            for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
                const saldoFavorUsadoN = $(`#valorUsoSaldoFavor${dataMesesHTML.nombreMes[i]}`)
                //console.log(saldoFavorUsadoN)
                //console.log(`saldoFavorUsadoN.val(): ${saldoFavorUsadoN.val()}`)
                if (saldoFavorUsadoN.val() != "") saldoActual += parseInt(saldoFavorUsadoN.val())
            }

            //?: 2) calculamos el saldo total (para mostrarlo en la tabla) que queda usando el saldo a favor
            if (usaSaldoFavor > 0) {
                if (deudaMes > 0) {
                    if (pagoAlumno != "") {
                        saldoTotal = parseInt(pagoAlumno) + usaSaldoFavor - deudaMes
                    } else {
                        saldoTotal = usaSaldoFavor - deudaMes
                    }
                } else {
                    if (pagoAlumno != "") {
                        saldoTotal = parseInt(pagoAlumno) + usaSaldoFavor - precioMes
                    } else {
                        saldoTotal = usaSaldoFavor - precioMes
                    }
                }
            }
            //?: 3) calculamos el saldo a favor actual restando la suma de los saldos 
            //?:    a favor de toda la tabla con el saldo a favor disponible del alumno
            saldoFavorActual = saldofavorHiddenHTML - saldoActual

            //?: 4) mostramos el saldo total luego de realizar la cuenta y lo mostramos en la tabla
            const saldoMes = $(`#saldo${nombreMes}`)
            saldoMes.html(`${saldoTotal} $`)
            saldoMes.val(saldoTotal)

            //?: 5) validamos que no se coloque un saldo a favor mayor al disponible para usar
            if (saldoFavorActual < 0) {
                alert("no puede colocar un numero mayor al saldo disponible")
                usaSaldoFavorHTML.val("")
            }
            //?: 5) si ya no queda saldo a favor disponible desactivamos los demas inputs
            if (saldoFavorActual == 0) {
                for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
                    const saldoFavorUsadoN = $(`#valorUsoSaldoFavor${dataMesesHTML.nombreMes[i]}`)
                    //console.log(`saldoFavorUsadoN.val(): ${saldoFavorUsadoN.val()}`)
                    if (saldoFavorUsadoN.val() == "") {
                        saldoFavorUsadoN.prop('disabled', true);
                    }
                }
            } else {
                for (let i = 0; i < dataMesesHTML.nombreMes.length; i++) {
                    const saldoFavorUsadoN = $(`#valorUsoSaldoFavor${dataMesesHTML.nombreMes[i]}`)
                    saldoFavorUsadoN.prop('disabled', false);
                }
            }

            //?: 5) agregamos el saldo a favor actual como un input hidden
            if (hiddenSaldoFavorActual.length == 0) {
                divSaldoFavorTotal.append(`
                    <input type="hidden" id="SaldofavorActual_${idAlumno}" value=${saldoFavorActual}>
                `)
            } else {
                hiddenSaldoFavorActual.val(saldoFavorActual)
            }

            //?: 6) mostramos un mensaje con el saldo a favor dispoble en el momento
            //#: datos del mensaje de saldo a favor mostrado
            var splitMsg = saldoFavorAlumnoMensaje.html().split("es de")
            var nuevoMensaje = `${splitMsg[0]} es de ${saldoFavorActual}$`
            var hiddenSaldoFavor = $(`#Saldofavor_${idAlumno}`)

            if (saldoFavorActual > 0) {
                saldoFavorAlumnoMensaje.html(nuevoMensaje)
            } else {
                var splitMsg2 = saldoFavorAlumnoMensaje.html().split("alumno:")
                var nombreAlumno = splitMsg2[1].split("es de")
                saldoFavorAlumnoMensaje.html(`ya uso todo el saldo a favor disponible del alumno: ${nombreAlumno[0]}`)
            }
        }
    })
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
    dataMesesHTML.saldoMes.splice(index, 1)
    dataMesesHTML.deuda.splice(index, 1)
    dataMesesHTML.usoSaldoFavor.splice(index, 1)
    dataMesesHTML.comentario.splice(index, 1)

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
        const usaSaldoFavorHTML = $(`#valorUsoSaldoFavor${nombreMes}`).val()
        var saldo = 0

        //console.log(`usaSaldoFavorHTML: ${usaSaldoFavorHTML}`)

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

        //console.log("dataMesesHTML")
        //console.log(dataMesesHTML)
        //console.log("transformamos el json en string")
        //console.log(transformData)
        //console.log("---------------------------------------------------")
        //console.log($(`#dataTotal`).val())
        //console.log("---------------------------------------------------")

        const idAlumn = $(`#idAlumno`).val()

        ordenarArray(dataMesesHTML)

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
    var tempComentario

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

                //#: ordenamos el array de comntarios
                tempComentario = jsonData.comentario[contador]
                jsonData.comentario[contador] = jsonData.comentario[index]
                jsonData.comentario[index] = saldoFavorTemp

                contador++
            }
        })
    })
}

