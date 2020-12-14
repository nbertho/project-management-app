const express = require('express');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/projects ROUTE');
  next();
});


router.get('/', function(req, res, next) {
  res.status(200).send('Main Projects Route');
});

module.exports = router;
