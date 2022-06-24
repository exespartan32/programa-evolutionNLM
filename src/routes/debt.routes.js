const express = require('express');
const router = express.Router();
const {
    renderAddDebt,
    saveDebt,
    renderListEdit,
    reciveEdit, saveEdit,
    renderListDelate,
    saveDelate,
    renderList,
    renderListAlumn,
    renderSearchAlumn
} = require('../controllers/debt.controllers');

// --------------------------------------------------------------- //
// ····················· ingresar deuda ·························· //
// --------------------------------------------------------------- //
router.get('/debt/enterDebt', renderAddDebt)
router.post('/debt/saveDebt', saveDebt)

// --------------------------------------------------------------- //
// ····················· editar deuda ···························· //
// --------------------------------------------------------------- //
router.get('/debt/editDebt', renderListEdit)
router.get('/debt/reciveEditDebt/:id', reciveEdit)
router.put('/debt/saveEditDebt/:id', saveEdit)

// --------------------------------------------------------------- //
// ····················· eliminar deuda ·························· //
// --------------------------------------------------------------- //
router.get('/debt/deleteDebt', renderListDelate)
router.delete('/debt/saveDeleteDebt/:id', saveDelate)
// --------------------------------------------------------------- //
// ·················· ver todas las  deudas ······················ //
// --------------------------------------------------------------- //
router.get('/debt/showDebt', renderList)
// --------------------------------------------------------------- //
// ·················· ver deuda de alumno x ······················ //
// --------------------------------------------------------------- //
router.get('/debt/searchDebtAlumn', renderSearchAlumn)
router.get('/debt/showDebtAlumn', renderListAlumn)

module.exports = router;