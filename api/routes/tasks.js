const express = require('express');
const db = require('../config/db');
const Joi = require('joi');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/tasks ROUTE');
  next();
});


// INDEX PROJECT TASK
router.get('/project/:project_id', (req, res) => {
  try {
    db.query('SELECT * FROM tasks WHERE project_id = ? ;', req.params.project_id, function(err, result, field) {
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


// CREATE TASK
router.put('/create/:project_id', async (req, res) => {
  
  // Create Joi obj for request body information
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string(),
    estimated_time: Joi.number(),
    project_id: Joi.number().integer().required(),
    parent_tasks_id: Joi.number().integer().required()
  });

  // Validate request body information
  let result = schema.validate(req.body);

  // If request body is invalid
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    // Check if project exist
    db.query('SELECT id FROM project WHERE id LIKE ?;', req.body.project_id, function (err, result, field) {
      // If error
      if (err) {
        throw err;
      }
      // If project doesn't exist
      else if (!result.length) {
        res.json({error: 'The ID you submitted is wrong'});
      }
      // If project exist
      else {
        db.query('INSERT INTO tasks SET ?;', 
          { name: req.body.name, 
            description: req.body.description, 
            estimated_time: req.body.estimated_time, 
            project_id: req.body.project_id, 
            parent_tasks_id: req.body.parent_tasks_id,
            status_id: 1
          }, function (err, insertResult, field) {
            if (err) {
              throw err;
            }
            else {
              // If task is created successfullt, return ID
              let { insertId } = insertResult;
              res.status(201).send('' + insertId);
            }
        });
      }
    });
  }
});



module.exports = router;
