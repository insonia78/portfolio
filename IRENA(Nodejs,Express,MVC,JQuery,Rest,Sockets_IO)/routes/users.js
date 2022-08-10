/*
 * Copyright 2018 Acelerex Inc.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Respond with a resource here');
});

module.exports = router;
