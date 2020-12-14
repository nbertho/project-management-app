const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/utilities ROUTE');
  next();
});


router.get('/', function(req, res, next) {
  res.status(200).send('Main Utilities Route');
});

module.exports = router;
