$('#mostrarContraseña').on('click', function () {
    if ($('#password').attr('type') == 'password') {
        $('#password').attr('type', 'text');
        $(this).html(`<i class="fa-regular fa-eye"></i>`)
    } else {
        $('#password').attr('type', 'password');
        $(this).html(`<span class="fa fa-eye-slash icon"></span>`)
    }
})

$('#mostrarContraseñaConfrim').on('click', function () {
    if ($('#passwordConfirm').attr('type') == 'password') {
        $('#passwordConfirm').attr('type', 'text');
        $(this).html(`<i class="fa-regular fa-eye"></i>`)
    } else {
        $('#passwordConfirm').attr('type', 'password');
        $(this).html(`<span class="fa fa-eye-slash icon"></span>`)
    }
})

$('#password').on('change', function () {
    const contraseñaUsuario = $(this).val()
    const contraseñaConfirm = $('#passwordConfirm')

    if (contraseñaUsuario != "") {
        contraseñaConfirm.prop('disabled', false)
    } else {
        contraseñaConfirm.prop('disabled', true)
    }
})

$('#passwordConfirm').on('change', function () {
    const contraseñaConfirm = $(this).val()
    const contraseñaUsuario = $('#password').val()

    //console.log(`contraseñaConfirm. ${contraseñaConfirm}`)
    //console.log(`contraseñaUsuario. ${contraseñaUsuario}`)

    if (contraseñaConfirm != contraseñaUsuario) {
        $(this).addClass("is-invalid")
        $('#inputConfirmPass').addClass("has-validation")
        $('#invalid-msg').html('la contraseña ingresada no es valida')
    } else {
        $(this).removeClass("is-invalid")
        $('#inputConfirmPass').removeClass("has-validation")
        $('#invalid-msg').html('')
    }
})

$('#FirstName').on('change', function () {
    var nombre = $(this).val()
    var apellido = $('#LastName').val()
    if (nombre && apellido) {
        searchNameAndLastName(nombre, apellido)
    }
})

$('#LastName').on('change', function () {
    var nombre = $('#FirstName').val()
    var apellido = $(this).val()
    if (nombre && apellido) {
        searchNameAndLastName(nombre, apellido)
    }
})

$('#emailUser').on('change', function () {
    var email = $(this).val()
    if (email) {
        $.ajax({
            url: `/users/findEmailAdress/${email}`,
            type: 'get',
            dataType: "json",
            success: function (data) {
                if (Object.keys(data).length > 0) {
                    alert('La Direccion de Correo Electronico ingresada ya esta en uso')
                    $('#emailUser').val('')
                }
            }
        })
    }

})


function searchNameAndLastName(nombre, apellido) {
    $.ajax({
        url: `/users/findFirstAndLastName/${nombre}/${apellido}`,
        type: 'get',
        dataType: "json",
        success: function (data) {
            if (Object.keys(data).length > 0) {
                var confirmacion = confirm('¡¡ ya existe un usuario con el mismo nombre y apellido !! \n¿desea cambiar los datos (aceptar) o dejarlos como estan (cancelar?')
                if (confirmacion) {
                    $('#FirstName').val('')
                    $('#LastName').val('')
                }
            }
        }
    })
}


$(document).ready(function () {
    $("#formularioCrearUsuario").submit(function (e) {
        const contraseñaConfirm = $('#passwordConfirm').val()
        const contraseñaUsuario = $('#password').val()

        if (contraseñaConfirm != contraseñaUsuario) {
            alert('la confirmacion de la contraseña resulto incorrecta')
            return false
        } else {
            return true
        }
    })
})