const express = require('express');
const db = require('../config/db');
const Joi = require('joi');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/projects ROUTE');
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
              res.status(401).json({error: 'Unauthorized'});
            }
          }
          else {
            res.status(401).json({error: 'Unauthorized'});
          }
        }
      });   
    }
    catch(e) {
      console.log(e);
      res.status(401).json({error: 'Unauthorized'})
    } 
  }
});


// CREATE PROJECT
router.put('/create', async (req, res) => {
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

});


// GET PROJECTS DETAILS
router.get('/show/:id', async (req, res) => {
  try {
    db.query('SELECT * FROM project WHERE id = ?', req.params.id, function(err, result, field) {
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


// UPDATE PROJECT
router.post('/update/:id', async (req, res) => {

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string(),
    active: Joi.number().integer(),
    status_id: Joi.number().integer(),
  });
  
  // Validate request body information
  let result = schema.validate(req.body);
    
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    db.query(`UPDATE project 
            SET name = ?, 
            description = ?, 
            active = ? ,
            status_id = ?
            WHERE (id = ?);`, 
            [ 
              req.body.name, 
              req.body.description, 
              req.body.active, 
              req.body.status_id,
              req.params.id 
            ] , 
            function (err, result, field) {
              if (err) {
                throw err;
              }
              else {
                res.status(200).json({success: `Project ${req.params.id} updated successfully`});
              }
    });
  }
});


module.exports = router;
