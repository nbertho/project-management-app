const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/users ROUTE');
  next();
});


router.get('/', async (req, res) => {
  try {
    let projectIndex = await db.promise().query(`SELECT * FROM users`);
    res.status(200).send(projectIndex[0]);
  } 
  catch (error) {
    res.status(403).send(error);
  }
});

module.exports = router;
