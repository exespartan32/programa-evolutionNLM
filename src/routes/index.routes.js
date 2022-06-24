const express = require('express');
const router = express.Router();
const { renderIndex } = require('../controllers/index.controllers')

// --------------------------------------------------------------- //
// ························· home ································ //
// --------------------------------------------------------------- //
router.get("/", renderIndex)


module.exports = router;