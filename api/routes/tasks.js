const express = require('express');
const db = require('../config/db');
const Joi = require('joi');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/tasks ROUTE');
  next();
});

// Verify user rights
router.use( async (req, res, next) => {
  const schema = Joi.object({
    users_id: Joi.number().integer(),
    token: Joi.string().min(20)
  });
  
  // Validate request body information
  let result = schema.validate(req.body);
    
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    try {
      db.query('SELECT * FROM project JOIN users_has_project on project.id = users_has_project.project_id WHERE (users_id = ? && token = ? && id == ?);', [req.body.users_id, req.body.token], function (err, result, field) {
        if (err) {
          console.log(err);
          throw err;
        }
        else {
          let data = result[0];
          if (data) {
            if (data.users_id == req.body.users_id && data.token == req.body.token) {
              next();
            }
            else {
              res.status(401).json({error: 'Unauthorised'});
            }
          }
          else {
            res.status(401).json({error: 'Unauthorised'});
          }
        }
      });   
    }
    catch(e) {
      console.log(e);
      res.status(401).json({error: 'Unauthorised'})
    } 
  }
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


// UPDATE TASK STATUS
router.post('/task/status/update/:id', async (req, res) => {

  const schema = Joi.object({
    status_id: Joi.number().integer().required(),
  });
  
  // Validate request body information
  let result = schema.validate(req.body);
    
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    db.query(`UPDATE tasks SET status_id = ? WHERE (id = ?);`, [ req.body.status_id, req.params.id], function (err, result, field) {
      if (err) {
        throw err;
      }
      else {
        res.status(200).json({success: `Task ${req.params.id} updated successfully`});
      }
    });
  }
});


// UPDATE TASK 
router.post('/task/update/:id', async (req, res) => {

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string(),
    estimated_time: Joi.number().integer(),
    status_id: Joi.number().integer().required(),
    parent_tasks_id: Joi.number().integer().required(),
  });
  
  // Validate request body information
  let result = schema.validate(req.body);
    
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    db.query(`UPDATE tasks 
            SET name = ?, 
            description = ?, 
            estimated_time = ?, 
            status_id = ?, 
            parent_tasks_id = ? 
            WHERE (id = ?);`, 
            [ 
              req.body.name, 
              req.body.description, 
              req.body.estimated_time, 
              req.body.status_id, 
              req.body.parent_tasks_id, 
              req.params.id 
            ] , 
            function (err, result, field) {
              if (err) {
                throw err;
              }
              else {
                res.status(200).json({success: `Task ${req.params.id} updated successfully`});
              }
    });
  }
});


// DELETE TASK
router.delete('/task/delete/:id', async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });
  
  // Validate request body information
  let result = schema.validate(req.params);
    
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    db.query('DELETE FROM tasks WHERE (id = ?);', req.params.id, function (err, result, field) {
      if (err) {
        throw err;
      }
      else {
        res.status(200).json({success: `Task ${req.params.id} deleted successfully`});
      }
    });
  }
});

module.exports = router;
