const express = require('express');
const db = require('../config/db');
const Joi = require('joi');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/projects ROUTE');
  next();
});


router.get('/', async (req, res) => {
  try {
    let projectIndex = await db.promise().query(`SELECT * FROM project`);
    res.status(200).send(projectIndex[0]);
  } 
  catch (error) {
    res.status(403).send(error);
  }
});

// GET ALL USER'S PROJECT

// CREATE PROJECT
router.post('/create', async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string(),
  });

  // Validate request body information
  let result = schema.validate(req.body);
  
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    require('crypto').randomBytes(48, function(err, buffer) {
      let token = buffer.toString('hex');
      try {
        db.query('INSERT INTO project SET ?', {name: req.body.name, token: token, active: 1, description: req.body.description, status_id: 1 }, function(err, insertResult, field) {
          if (err) {
            throw err;
          }
          else {
            let { insertId } = insertResult;
            res.status(201).send('' + insertId);
          }
        });
      } 
      catch (error) {
        res.status(400).json({error: error});
      }
    });
  }

})

// UPDATE PROJECT

// DELETE PROJECT

module.exports = router;
