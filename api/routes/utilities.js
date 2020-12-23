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


// GET ROLES
router.get('/status', (req, res) => {
  try {
    db.query('SELECT * FROM status;', function(err, result, field) {
      if (err) {
        throw err;
      }
      else {
        res.send(result);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});


// GET STATUS
router.get('/roles', (req, res) => {
  try {
    db.query('SELECT * FROM role;', function(err, result, field) {
      if (err) {
        throw err;
      }
      else {
        res.send(result);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});


module.exports = router;
