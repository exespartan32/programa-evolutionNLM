const debtControllers = {};
const Deudas = require('../models/Deudas')
const url = require('url');

// --------------------------------------------------------------- //
// ····················· ingresar deuda ·························· //
// --------------------------------------------------------------- //
debtControllers.renderAddDebt = (req, res) => {
    res.render('deudas/addDebt')
}

debtControllers.saveDebt = async (req, res) => {
    const data = (req.body)
    const { nombreAlumno, apellidoAlumno, deuda } = data

    const errors = [];
    if (!nombreAlumno) {
        errors.push({ text: 'Por Favor escriba un Nombre' })
    }
    if (!apellidoAlumno) {
        errors.push({ text: 'Por Favor escriba un Apellido' })
    }
    if (!deuda) {
        errors.push({ text: 'Por Favor ingrese una deuda' })
    }

    if (errors.length > 0) {
        res.render('deudas/addDebt', {
            errors,
            nombreAlumno,
            apellidoAlumno,
            deuda
        })
    } else {
        const newPay = new Deudas({ nombreAlumno, apellidoAlumno, deuda })
        await newPay.save()

        /*const message = [];
        if (nombreAlumno && apellidoAlumno && deuda) {
            message.push({ text: 'datos correctos' })
        }*/

        req.flash('success_msg', 'deuda agregada correctamente');
        res.redirect('/debt/enterDebt')
        //res.render('deudas/addDebt', { message })
    }
}

// --------------------------------------------------------------- //
// ····················· editar deuda ···························· //
// --------------------------------------------------------------- //
debtControllers.renderListEdit = async (req, res) => {
    const debts = await Deudas.find().sort({ date: 'desc' });
    res.render('deudas/listEditDebt', { debts })
}

debtControllers.reciveEdit = async (req, res) => {
    const id = req.params.id
    const deuda = await Deudas.findById(id)
    res.render('deudas/editDebt', { deuda })
}

debtControllers.saveEdit = async (req, res) => {
    //console.log(req.body)
    const { nombreAlumno, apellidoAlumno, deuda } = req.body
    await Deudas.findByIdAndUpdate(req.params.id, { nombreAlumno, apellidoAlumno, deuda })

    req.flash('success_msg', 'deuda editada correctamente');

    res.redirect('/debt/editDebt')
}

// --------------------------------------------------------------- //
// ····················· eliminar deuda ·························· //
// --------------------------------------------------------------- //
debtControllers.renderListDelate = async (req, res) => {
    const debts = await Deudas.find().sort({ date: 'desc' });
    res.render('deudas/listRemuveDebt', { debts })
}

debtControllers.saveDelate = async (req, res) => {
    const id = req.params.id
    await Deudas.findByIdAndDelete(id)
    
    req.flash('success_msg', 'deuda eliminada correctamente');

    res.redirect('/debt/deleteDebt')
}
// --------------------------------------------------------------- //
// ·················· ver todas las  deudas ······················ //
// --------------------------------------------------------------- //
debtControllers.renderList = async (req, res) => {
    const debts = await Deudas.find().sort({ date: 'desc' });
    //console.log(debts)
    res.render('deudas/showDebt', { debts })
}

// --------------------------------------------------------------- //
// ·················· ver deuda de alumno x ······················ //
// --------------------------------------------------------------- //
debtControllers.renderSearchAlumn = async (req, res) => {
    res.render('deudas/searchDebtAlumn')
}

debtControllers.renderListAlumn = async (req, res) => {
    if (typeof window !== 'undefined') {
        var parametros = window.location.search;
        var urlParams = new URLSearchParams(parametros);
        var nombre = urlParams.get('nombreAlumno');
        var apellido = urlParams.get('apellidoAlumno');

        // ······························································· //
        // ··············· si no existe nombre y apellido ················ //
        // ······························································· //
        if (!nombre && !apellido) {
            res.send('error')
        } else {
            // ······························································· //
            // ··············· si existe nombre y apellido ··················· //
            // ······························································· //
            if (nombre && apellido) {
                const debts = await Deudas.find({
                    nombreAlumno: { $eq: nombre },
                    apellidoAlumno: { $eq: apellido }
                })
                // ---------------------------------------------------------------------- //
                // ----------- si no encentra ningun nombre y apellido en DB------------- //
                // ---------------------------------------------------------------------- //
                if (debts.length == 0) {
                    res.send('datos inexistentes')
                    // ---------------------------------------------------------------------- //
                    // ----------- si encentra un nombre y apellido en DB ------------------- //
                    // ---------------------------------------------------------------------- //
                } else {
                    res.render('deudas/showDebt', { debts })
                }
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
                // :::::::::::: si exixte nombre o apellido, pero no ambos a la vez :::::::::::: //
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
            } else {
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                // ;;;;;;;;;;;;; si existe nombre ;;;;;;;;;;;; //
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                if (nombre) {
                    const debts = await Deudas.find({
                        nombreAlumno: { $eq: nombre }
                    })
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    // <<<<<<<<<<<<<<< si encuentra nombre en DB <<<<<<<<< //
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    if (debts.length == 0) {
                        res.send('nombre inexistentes')
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                        // <<<<<<<<<<<<< si no encuentra nombre en DB <<<<<<<< //
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    } else {
                        res.render('deudas/showDebt', { debts })
                    }
                }
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                // ;;;;;;;;;;;;; si existe apellido ;;;;;;;;;;;; //
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                if (apellido) {
                    const debts = await Deudas.find({
                        apellidoAlumno: { $eq: apellido }
                    })
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    // <<<<<<<<<<<<< si encuentra apellido en DB <<<<<<<<< //
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    if (debts.length == 0) {
                        res.send('apellido inexistentes')
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                        // <<<<<<<<<<<<< si no encuentra apellido en DB <<<<<< //
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    } else {
                        res.render('deudas/showDebt', { debts })
                    }
                }
            }
        }
    } else {
        const q = url.parse(req.url, true);
        const qdata = q.query;
        const nombre = qdata.nombreAlumno;
        const apellido = qdata.apellidoAlumno;


        // ······························································· //
        // ··············· si no existe nombre y apellido ················ //
        // ······························································· //
        if (!nombre && !apellido) {
            res.send('error')
        } else {
            // ······························································· //
            // ··············· si existe nombre y apellido ··················· //
            // ······························································· //
            if (nombre && apellido) {
                const debts = await Deudas.find({
                    nombreAlumno: { $eq: nombre },
                    apellidoAlumno: { $eq: apellido }
                })
                // ---------------------------------------------------------------------- //
                // ----------- si no encentra ningun nombre y apellido en DB------------- //
                // ---------------------------------------------------------------------- //
                if (debts.length == 0) {
                    res.send('datos inexistentes')
                    // ---------------------------------------------------------------------- //
                    // ----------- si encentra un nombre y apellido en DB ------------------- //
                    // ---------------------------------------------------------------------- //
                } else {
                    res.render('deudas/showDebt', { debts })
                }
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
                // :::::::::::: si exixte nombre o apellido, pero no ambos a la vez :::::::::::: //
                // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
            } else {
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                // ;;;;;;;;;;;;; si existe nombre ;;;;;;;;;;;; //
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                if (nombre) {
                    const debts = await Deudas.find({
                        nombreAlumno: { $eq: nombre }
                    })
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    // <<<<<<<<<<<<<<< si encuentra nombre en DB <<<<<<<<< //
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    if (debts.length == 0) {
                        res.send('nombre inexistentes')
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                        // <<<<<<<<<<<<< si no encuentra nombre en DB <<<<<<<< //
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    } else {
                        res.render('deudas/showDebt', { debts })
                    }
                }
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                // ;;;;;;;;;;;;; si existe apellido ;;;;;;;;;;;; //
                // ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; //
                if (apellido) {
                    const debts = await Deudas.find({
                        apellidoAlumno: { $eq: apellido }
                    })
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    // <<<<<<<<<<<<< si encuentra apellido en DB <<<<<<<<< //
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    if (debts.length == 0) {
                        res.send('apellido inexistentes')
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                        // <<<<<<<<<<<<< si no encuentra apellido en DB <<<<<< //
                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
                    } else {
                        res.render('deudas/showDebt', { debts })
                    }
                }
            }
        }
    }
}



module.exports = debtControllers