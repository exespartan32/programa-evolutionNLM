function listMonth(valCourse) {
    const numerMonth = []
    const nameMonth = []
    for (var i = 0; i < valCourse.length; i++) {
        const month = valCourse[i].mes
        switch (month) {
            case "2023-01":
                numerMonth.push(month)
                nameMonth.push("Enero")
                break;
            case "2023-02":
                numerMonth.push(month)
                nameMonth.push("Febrero")
                break;
            case "2023-03":
                numerMonth.push(month)
                nameMonth.push("Marzo")
                break;
            case "2023-04":
                numerMonth.push(month)
                nameMonth.push("Abril")
                break;
            case "2023-05":
                numerMonth.push(month)
                nameMonth.push("Mayo")
                break;
            case "2023-06":
                numerMonth.push(month)
                nameMonth.push("Junio")
                break;
            case "2023-07":
                numerMonth.push(month)
                nameMonth.push("Julio")
                break;
            case "2023-08":
                numerMonth.push(month)
                nameMonth.push("Agosto")
                break;
            case "2023-09":
                numerMonth.push(month)
                nameMonth.push("Septiembre")
                break;
            case "2023-10":
                numerMonth.push(month)
                nameMonth.push("Octubre")
                break;
            case "2023-11":
                numerMonth.push(month)
                nameMonth.push("Noviembre")
                break;
            case "2023-12":
                numerMonth.push(month)
                nameMonth.push("Diciembre")
                break;
        }
    }
    return {"numerMonth": numerMonth, "nameMonth": nameMonth}
}

function convertMonth(mes){
    var index = nombreMes.findIndex(x => x === mes)
    //console.log("index del mes es: "+ index)
    var mesConv = numeroMes[index]
    return mesConv
}

module.exports = {listMonth, convertMonth}