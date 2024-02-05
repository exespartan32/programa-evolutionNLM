/* $('#fechaInicioCurso').on('change', function () {
  if ($('#duracion').val()) {
    var starDate = $('#fechaInicioCurso').val().split("-")
    var intYear = parseInt(starDate[0])
    var intMonth = parseInt(starDate[1])
    var durationInt = parseInt($('#duracion').val())
    const response = loadMonth(durationInt, intMonth, intYear)
    //console.log(response)
    $('#fechaFinCurso').val(response)
  } else {
    alert('primero complete la duracion que tendra el curso')
    $('#fechaInicioCurso').val('')
  }
}) */

$('#duracion').on('change', function () {
  //alert("cambio la duracion")
  if ($(this).val() != "") {
    var starDate = $('#fechaInicioCurso').val().split("-")
    if (starDate.length == 2) {
      var intYear = parseInt(starDate[0])
      var intMonth = parseInt(starDate[1])
      var durationInt = parseInt($(this).val())

      const response = loadMonth(durationInt, intMonth, intYear)
      $('#fechaFinCurso').val(response)
    }
  }
})

$('#fechaInicioCurso').on('change', function () {
  var fechaActual = $(this).val()
  if ($('#duracion').val() && $('#duracion').val() != "") {
    var starDate = fechaActual.split("-")

    if (starDate.length == 2) {
      var intYear = parseInt(starDate[0])
      var intMonth = parseInt(starDate[1])
      var durationInt = parseInt($('#duracion').val())

      const response = loadMonth(durationInt, intMonth, intYear)
      $('#fechaFinCurso').val(response)
    }
  }
})

$('#nombre').on('change', function () {
  var nombreOriginal = $('#nombreCursoOriginal').val()
  $.ajax({
    url: '/course/searchCourse/' + $(this).val(),
    success: function (data) {
      console.log(data)
      if (data != null) {
        alert('ya existe un curso con ese nombre, debe colocar otro nombre')
        const nombreCursoOriginal = $('#nombreCursoOriginal').val()
        if(nombreCursoOriginal){
          $('#nombre').val(nombreOriginal)
        }else{
          $('#nombre').val('')
        }
      }
    }
  })
})


function loadMonth(duracion, mesInicio, año) {
  var resultMonth = mesInicio + duracion - 1
  var valMonth
  var valYear

  valYear = String(año)
  if (resultMonth < 10) {
    var valMonth = "0" + String(resultMonth)
  } else {
    var valMonth = String(resultMonth)
  }

  if (valMonth > 12) {
    var resMonthInt = valMonth - 12
    var resYearInt = año + 1

    valYear = String(resYearInt)
    if (resMonthInt < 10) {
      valMonth = "0" + String(resMonthInt)
    } else {
      valMonth = String(resMonthInt)
    }
  }
  var endDate = valYear + "-" + valMonth
  return endDate
}


$(document).ready(function () {
  $("#formularioEditarCurso").submit(function (e) {
    //e.preventDefault();
    //alert("enviar formulario")

    var dataCursoOriginal = $('#dataCursoOriginal').val()
    var jsonData = JSON.parse(dataCursoOriginal)

    var nombreCursoOriginal = jsonData.nombre
    var duracionCursoOriginal = jsonData.duracion
    var FechaInicioOriginal = jsonData.fechaInicioCurso

    var nombreCurso = $('#nombre').val()
    var duracionCurso = $('#duracion').val()
    var FechaInicio = $('#fechaInicioCurso').val()

    if (
      nombreCurso == nombreCursoOriginal
      && duracionCurso == duracionCursoOriginal
      && FechaInicio == FechaInicioOriginal
    ) {
      var confirmacion = confirm('                             ¡¡ No se han realizado cambios !! \npulse aceptar si desea continuar sin realizar cambio o cancelar si desea continuar realizando cambios')

      if (!confirmacion) {
        return false
      } else {
        window.location.replace('/course/showCourse')
        return false
      }
    }
  })
})