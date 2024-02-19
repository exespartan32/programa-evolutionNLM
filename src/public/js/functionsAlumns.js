var alumnos = []
var alumnoDNI

$('#nombreAlumno').on('change', function () {
    var valorNombreAlumno = $(this).val()
    var valorApellidoAlumno = $('#apellidoAlumno').val()
    var valorDNI_Alumno = $('#dniAlumno').val()

    if (valorNombreAlumno && valorApellidoAlumno && valorDNI_Alumno) {
        buscarCoincidenciaAlumnoDB(valorNombreAlumno.toLowerCase(), valorApellidoAlumno.toLowerCase(), valorDNI_Alumno)
    }
})

$('#apellidoAlumno').on('change', function () {
    var valorNombreAlumno = $('#nombreAlumno').val()
    var valorApellidoAlumno = $(this).val()
    var valorDNI_Alumno = $('#dniAlumno').val()

    if (valorNombreAlumno && valorApellidoAlumno && valorDNI_Alumno) {
        buscarCoincidenciaAlumnoDB(valorNombreAlumno.toLowerCase(), valorApellidoAlumno.toLowerCase(), valorDNI_Alumno)
    }
})

$('#dniAlumno').on('change', function () {
    var valorNombreAlumno = $('#nombreAlumno').val()
    var valorApellidoAlumno = $('#apellidoAlumno').val()
    var valorDNI_Alumno = $(this).val()

    if (valorDNI_Alumno) {
        buscarCoincidenciaAlumnoDNI(valorDNI_Alumno)
    }

    if (valorNombreAlumno && valorApellidoAlumno && valorDNI_Alumno) {
        buscarCoincidenciaAlumnoDB(valorNombreAlumno.toLowerCase(), valorApellidoAlumno.toLowerCase(), valorDNI_Alumno)
    }
})

$('#cursos').on('change', function () {
    var valorIDCurso = $(this).val()
    var IDcursoActual = $('#cursoActivoOriginal').val()
    var labelCurso = $('#labelCurso')

    if (IDcursoActual) {
        if (valorIDCurso == IDcursoActual) {
            labelCurso.html('Curso Activo')
        } else {
            labelCurso.html('Curso')
        }
    }

})

function buscarCoincidenciaAlumnoDB(nombreAlumno, apellidoAlumno, DNI_Alumno) {
    $.ajax({
        url: `/alumn/searchDNI/${nombreAlumno}/${apellidoAlumno}/${DNI_Alumno}`,
        success: function (data) {
            //console.log('concidencias con los datos ingresados')
            //console.log(data)
            //console.log('---------------------------------------------------')
            if (data) {
                alumnos.push(data)
            } else {
                alumnos = []
            }
        }
    })
}

function buscarCoincidenciaAlumnoDNI(DNI_Alumno) {
    $.ajax({
        url: `/alumn/searchDNI/${DNI_Alumno}`,
        success: function (data) {
            if(data){
                alert('ya existe un alumno con el DNI ingresado, no puede repetirse')
                $('#dniAlumno').val('')
            }
        }
    })
}

$(document).ready(function () {
    $("#formularioAgregarAlumno").submit(function (e) {
        if (alumnos.length > 0) {
            alert('ya existe un alumno guardado con los mismos datos ingresados')
            return false
        } else {
            return true
        }
    })
})


$("#formularioEditarAlumno").submit(function (e) {
    //e.preventDefault();
    var formularioAction = $('#formularioAction').val()

    var datosAlumnoOriginal = JSON.parse($('#datosAlumnoOriginal').val())
    console.log(datosAlumnoOriginal)

    var valorNombreAlumno = $('#nombreAlumno').val()
    var valorApellidoAlumno = $('#apellidoAlumno').val()
    var valorDNI_Alumno = $('#dniAlumno').val()

    var cursoActivoOriginal = $('#cursoActivoOriginal').val()
    var cursoActual = $('#cursos').val()

    // # : -------------------------------------------------------------------------------------------- : # //
    // # : -------------- si no se modifican datos mostramos un mensaje de confirmacion --------------- : # //
    // # : -------- 1) si se de en aceptar se muetsra nuevamente la lista de selecion de curso -------- : # //
    // # : ------ 2) si se de en cancelar no se hace nada y se sigue trabajando en el formulario ------ : # //
    // # : -------------------------------------------------------------------------------------------- : # //
    if (valorNombreAlumno == datosAlumnoOriginal.nombre &&
        valorApellidoAlumno == datosAlumnoOriginal.apellido &&
        valorDNI_Alumno == datosAlumnoOriginal.DNI &&
        cursoActivoOriginal == cursoActual
    ) {
        var confirmacion = confirm('                             ¡¡ No se han realizado cambios !! \npulse aceptar si desea continuar sin realizar cambio o cancelar si desea continuar realizando cambios')

        if (formularioAction == 'showAllAlumn') {
            if (!confirmacion) {
                return false
            } else {
                window.location.replace('/alumn/showAllAlumn')
                return false
            }
        }
        if (formularioAction == 'showAlumn') {
            if (!confirmacion) {
                return false
            } else {
                window.location.replace('/alumn/selectCourseShowAlumn')
                return false
            }
        }
    } else {
        // # : ----------------------------------------------------------------------------- : # //
        // # : -- validamos que no exista un alumno en DB con los mismos datos ingresados -- : # //
        // # : ----------------------------------------------------------------------------- : # //
        if (alumnos.length > 0) {
            alert('ya existe un alumno guardado con los mismos datos ingresados')
            return false
        } else {
            return true
        }
    }
})