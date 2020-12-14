const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/tasks ROUTE');
  next();
});


router.get('/', function(req, res, next) {
  res.status(200).send('Main Tasks Route');
});

module.exports = router;
