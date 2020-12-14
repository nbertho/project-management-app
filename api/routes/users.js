const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/users ROUTE');
  next();
});


router.get('/', function(req, res, next) {
  res.status(200).send('Main Users Route');
});

module.exports = router;
