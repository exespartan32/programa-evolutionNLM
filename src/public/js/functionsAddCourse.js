$(function altoCompleteEndDate() {
  $('#fechaInicioCurso').on('change', function () {
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
  })

  $('#duracion').on('change', function () {
    if ($('#duracion').val()) {
      var starDate = $('#fechaInicioCurso').val().split("-")
      var intYear = parseInt(starDate[0])
      var intMonth = parseInt(starDate[1])
      var durationInt = parseInt($('#duracion').val())
      const response = loadMonth(durationInt, intMonth, intYear)
      //console.log(response)
      $('#fechaFinCurso').val(response)
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

