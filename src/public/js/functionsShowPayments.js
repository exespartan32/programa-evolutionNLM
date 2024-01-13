$('#mostrarFiltros').on('click', function () {
    var contenedorBotonFiltros = $('#contenedorBotonFiltros')
    var contenedorFiltros = $('#contenedorFiltros')
    contenedorFiltros.append(`
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="nombreCursoCheck" onchange="mostrarFiltroSeleccionado('nombreCursoCheck')">
            <label class="form-check-label" for="nombreCursoCheck"><strong>Nombre Del Curso</strong></label>
        </div>

        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="nombre_ApellidoAlumnoCheck" onchange="mostrarFiltroSeleccionado('nombre_ApellidoAlumnoCheck')">
            <label class="form-check-label" for="nombre_ApellidoAlumnoCheck"><strong>Nombre y Apellido Alumno</strong></label>
        </div>
        
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="fechaPagoCheck" onchange="mostrarFiltroSeleccionado('fechaPagoCheck')">
            <label class="form-check-label" for="fechaPagoChech"><strong>Fecha de Pago</strong></label>
        </div>
    `)
    contenedorBotonFiltros.html(`<button class="btn btn-secondary me-md-2" type="button" id="AplicarFiltros" onclick="aplicarFiltros()">AplicarFiltros</button>`)
})

function mostrarFiltroSeleccionado(filtro) {
    var check = $(`#${filtro}`).prop('checked')

    if (filtro == 'nombreCursoCheck') {
        var contenedorNombreCurso = $('#contenedorNombreCurso')
        var NombreCursos = ($('#nombreCursos').val()).split(",")
        if (check) {
            contenedorNombreCurso.append(`
                <div class="input-group ">
                    <label for="NombreCursoInput" class="input-group-text"> Cursos </label>
                    <select class="form-select" id="NombreCursoInput" required>
                        <option selected disabled> Abrir menu de seleccion de los cursos </option>
                    </select>
                </div>
            `)
            for (let i = 0; i < NombreCursos.length; i++) {
                $(document).ready(function () {
                    $('#NombreCursoInput').append(`
                    <option value="${NombreCursos[i]}">${NombreCursos[i]}</option>
                `)
                })
            }
        } else {
            contenedorNombreCurso.html('')
        }
    }

    if (filtro == 'nombre_ApellidoAlumnoCheck') {
        var contenedorNombreyApellido = $('#contenedorNombreyApellido')
        if (check) {
            contenedorNombreyApellido.append(`
                <div class="input-group">
                    <label class="input-group-text"> Nombre y Apellido </label>
                    <input type="text" placeholder="nombre" class="form-control" id="NombreAlumnoInput" required>
                    <input type="text" placeholder="apellido" class="form-control" id="ApellidoAlumnoInput" required>
                </div>
            `)
        } else {
            contenedorNombreyApellido.html('')
        }
    }

    if (filtro == 'fechaPagoCheck') {
        var contenedorFechaPago = $('#contenedorFechaPago')
        if (check) {
            contenedorFechaPago.append(`
                <div class="input-group">
                    <label for="fechaPagoInput" class="input-group-text" required> Fecha de Pago </label>
                    <input type="month" class="form-control" id="FechaPagoInput" required>
                </div>
            `)
        } else {
            contenedorFechaPago.html('')
        }
    }
}

$('#buscarNumeroBoleta').on('click', function () {
    var numeroBoleta = $('#NumeroBoletaIInput')
    var valorNumeroBoleta = numeroBoleta.val()

    if (valorNumeroBoleta == "") {
        alert('debe colocar algun numero para poder realizar la busuqeda')
        numeroBoleta.val('')
    } else {
        if (valorNumeroBoleta < 1) {
            alert('no debe colocar algun numero menor que 1')
        } else {
            var contadorResultado = 0
            $('#tabla tr').each(function () {
                var columnaNumeroBoleta = $(this).find("td").eq(0).html();

                if (valorNumeroBoleta == columnaNumeroBoleta) {
                    $(this).show()
                    contadorResultado++
                } else {
                    $(this).hide()
                }
            })
            if (contadorResultado == 0) {
                mostrarMensajeError(true)
            } else {
                mostrarMensajeError(false)
            }
        }
    }
})


var NombreAlumno = ""
var ApellidoAlumno = ""
function aplicarFiltros() {
    $('#NumeroBoletaIInput').val('')

    //#: check de los filtros
    var checkNombreCurso = $('#nombreCursoCheck').prop('checked')
    var checkNumeroBoleta = $('#numeroBoletaCheck').prop('checked')
    var checkNombreyApellidoAlumno = $('#nombre_ApellidoAlumnoCheck').prop('checked')
    var checkFechaPago = $('#fechaPagoCheck').prop('checked')

    //#: valor de los filtros
    var NombreCursoInput = $('#NombreCursoInput').val()
    var NumeroBoletaIInput = $('#NumeroBoletaIInput').val()

    var NombreAlumnoInput = $('#NombreAlumnoInput').val()
    if (NombreAlumnoInput) {
        NombreAlumnoInput = NombreAlumnoInput.toLowerCase()
        NombreAlumno = NombreAlumnoInput
    } else {
        NombreAlumnoInput = ""
        NombreAlumno = ""
    }

    var ApellidoAlumnoInput = $('#ApellidoAlumnoInput').val()
    if (ApellidoAlumnoInput) {
        ApellidoAlumnoInput = ApellidoAlumnoInput.toLowerCase()
        ApellidoAlumno = ApellidoAlumnoInput
    } else {
        ApellidoAlumnoInput = ""
        ApellidoAlumno = ""
    }

    var fechaPagoInput = $('#FechaPagoInput').val()

    // ?: ------------------------------------------------------------------------- :? //
    // ?: --------- validamos que no se traten de aplicar filtros vacios ---------- :? //
    // ?: ------------------------------------------------------------------------- :? //
    var contadorErrorres = 0
    if (!checkNombreCurso && !checkNumeroBoleta && !checkNombreyApellidoAlumno && !checkFechaPago) {
        alert('primero debe seleccionar algun filtro de busqueda')
        contadorErrorres++
    }

    if (checkNombreCurso) {
        if (NombreCursoInput == null) {
            alert('debe seleccionar algun curso para aplicar el filtro')
            contadorErrorres++
        }
    }
    if (checkNumeroBoleta) {
        if (NumeroBoletaIInput == "") {
            alert('debe colocar algun numero de boleta para aplicar el filtro')
            contadorErrorres++
        }
    }
    if (checkNombreyApellidoAlumno) {
        if (NombreAlumnoInput == "" && ApellidoAlumnoInput == "") {
            alert('debe colocar al menos uno de los datos solicitados para plicar el filtro')
        }
    }


    if (checkFechaPago) {
        if (fechaPagoInput == "") {
            alert('debe seleccionar algua fecha para aplicar el filtro')
            contadorErrorres++
        }
    }

    if (contadorErrorres == 0) {
        // ?: ------------------------------------------------------------------------- :? //
        // ?: ------------- buscamos el la tabla filtrando los resultados ------------- :? //
        // ?: ------------------------------------------------------------------------- :? //
        var contadorResultado = 0
        $('#tabla tr').each(function () {
            var columnaNumeroBoleta = $(this).find("td").eq(0).html();
            var columnaNombreCurso = $(this).find("td").eq(1).html();
            var columnaNombreAlumno = $(this).find("td").eq(2).html();
            var columnaApellidoAlumno = $(this).find("td").eq(3).html();
            var columnafechaPago = $(this).find("td").eq(6).html();

            //?: parseamos el string de fecha para comrobar los datos
            var fechaPagoSplit = columnafechaPago.split("/")
            var año = fechaPagoSplit[2]
            var mes = parseInt(fechaPagoSplit[1])
            if (mes < 10) { mes = `0${mes}` }
            var fecha = `${año}-${mes}`


            // % ------------------------------------------ % //
            // % ------- filtro de numero de boleta ------- % //
            // % ------------------------------------------ % //
            if (checkNumeroBoleta) {
                if (columnaNumeroBoleta == NumeroBoletaIInput) {
                    $(this).show()
                    contadorResultado++
                } else {
                    $(this).hide()
                }
            }


            // # ----------------------------------------------- # //
            // # ------- cuando se aplica un solo filtro ------- # //
            // # ----------------------------------------------- # //
            //?: nombre del curso
            if (checkNombreCurso && !checkNombreyApellidoAlumno && !checkFechaPago) {
                if (columnaNombreCurso == NombreCursoInput) {
                    $(this).show()
                    contadorResultado++
                } else {
                    $(this).hide()
                }
            }

            //?: --------------------------------------------------------------------------------------------
            //?: nombre y apellido del alumno
            if (checkNombreyApellidoAlumno && !checkNombreCurso && !checkFechaPago) {
                if (NombreAlumno && !ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (!NombreAlumno && ApellidoAlumno) {
                    if (columnaApellidoAlumno.includes(ApellidoAlumno)) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (NombreAlumno && ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno) && columnaApellidoAlumno.includes(ApellidoAlumno)) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
            }

            //?: --------------------------------------------------------------------------------------------
            //?: fecha de pago
            if (checkFechaPago && !checkNombreCurso && !checkNombreyApellidoAlumno) {
                if (fecha == fechaPagoInput) {
                    $(this).show()
                    contadorResultado++
                } else {
                    $(this).hide()
                }
            }

            // # ----------------------------------------------- # //
            // # --------- cuando se aplican dos filtro -------- # //
            // # ----------------------------------------------- # //
            //?: --------------------------------------------------------------------------------------------
            //?: nombre del curso, y nombre y apellido del alumno
            if (checkNombreCurso && checkNombreyApellidoAlumno && !checkFechaPago) {

                if (NombreAlumno && !ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)
                        && columnaNombreCurso == NombreCursoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (!NombreAlumno && ApellidoAlumno) {
                    if (columnaApellidoAlumno.includes(ApellidoAlumno)
                        && columnaNombreCurso == NombreCursoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (NombreAlumno && ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)
                        && columnaApellidoAlumno.includes(ApellidoAlumno)
                        && columnaNombreCurso == NombreCursoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }


            }

            //?: --------------------------------------------------------------------------------------------
            //?: nombre del curso, y fecha de pago
            if (checkNombreCurso && checkFechaPago && !checkNombreyApellidoAlumno) {
                if (columnaNombreCurso == NombreCursoInput && fecha == fechaPagoInput) {
                    $(this).show()
                    contadorResultado++
                } else {
                    $(this).hide()
                }
            }

            //?: --------------------------------------------------------------------------------------------
            //?: fecha de pago, y nombre y apellido del alumno
            if (checkFechaPago && checkNombreyApellidoAlumno && !checkNombreCurso) {
                if (NombreAlumno && !ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)
                        && columnaNombreCurso == NombreCursoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (!NombreAlumno && ApellidoAlumno) {
                    if (columnaApellidoAlumno.includes(ApellidoAlumno)
                        && columnaNombreCurso == NombreCursoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (NombreAlumno && ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)
                        && columnaApellidoAlumno.includes(ApellidoAlumno)
                        && columnaNombreCurso == NombreCursoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
            }

            // # ----------------------------------------------- # //
            // # -------------- cuando se aplican  ------------- # //
            // # ----------- los tres filtro juntos  ----------- # //
            // # ----------------------------------------------- # //
            if (checkNombreCurso && checkNombreyApellidoAlumno && checkFechaPago) {

                if (NombreAlumno && !ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)
                        && columnaNombreCurso == NombreCursoInput
                        && fecha == fechaPagoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (!NombreAlumno && ApellidoAlumno) {
                    if (columnaApellidoAlumno.includes(ApellidoAlumno)
                        && columnaNombreCurso == NombreCursoInput
                        && fecha == fechaPagoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
                if (NombreAlumno && ApellidoAlumno) {
                    if (columnaNombreAlumno.includes(NombreAlumno)
                        && columnaApellidoAlumno.includes(ApellidoAlumno)
                        && columnaNombreCurso == NombreCursoInput
                        && fecha == fechaPagoInput) {
                        $(this).show()
                        contadorResultado++
                    } else {
                        $(this).hide()
                    }
                }
            }

        })

        //console.log(`cantidad de resultados en la tabla: ${contadorResultado}`)
        if (contadorResultado == 0) {
            mostrarMensajeError(true)
        } else {
            mostrarMensajeError(false)
        }
    }
}

function mostrarMensajeError(estado) {
    var containerMensajeError = $('#containerMensajeError')
    if (estado) {
        containerMensajeError.html(`
            <div class="alert alert-danger alert-dismissible fade show text-center text-danger" role="alert">
                <i class="fa-solid fa-triangle-exclamation" style="color: #d71d1d; font-size: 2rem; "></i>
                <strong>No se encontraron resultados</strong>
                <i class="fa-solid fa-triangle-exclamation" style="color: #d71d1d; font-size: 2rem;"></i>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `)
    } else {
        containerMensajeError.html('')
    }
}



function quitarFiltros() {
    //#: check de los filtros
    var checkNombreCurso = $('#nombreCursoCheck').prop('checked')
    var checkNombreyApellidoAlumno = $('#nombre_ApellidoAlumnoCheck').prop('checked')
    var checkFechaPago = $('#fechaPagoCheck').prop('checked')

    //#: valor de los filtros
    var NombreCursoInput = $('#NombreCursoInput')
    var NumeroBoletaIInput = $('#NumeroBoletaIInput')
    var NombreAlumnoInput = $('#NombreAlumnoInput')
    var ApellidoAlumnoInput = $('#ApellidoAlumnoInput')
    var fechaPagoInput = $('#FechaPagoInput')

    if (NumeroBoletaIInput.val()) { NumeroBoletaIInput.val('') }

    if (checkNombreCurso) { NombreCursoInput.val('') }

    if (checkNombreyApellidoAlumno) {
        NombreAlumnoInput.val('')
        ApellidoAlumnoInput.val('')
    }

    if (checkFechaPago) { fechaPagoInput.val('') }

    $('#tabla tr').each(function () {
        $(this).show()
    })

}