const express = require('express');
const db = require('../config/db');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/login ROUTE');
  next();
});

// LOGIN
router.post('/login', async (req, res, next) => {
  const schema = Joi.object({
    mail: Joi.string().email({ tlds: { allow: false }}).required(),
    pwd: Joi.string().min(6).required()
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
      db.query('SELECT * from users WHERE email LIKE ?;', req.body.mail, function(err, result, field) {
        if(result.length == 1) {
          const dbMail = result[0].email;
          const dbPwd = result[0].password;
          const dbId = result[0].id;
          bcrypt.compare(req.body.pwd, dbPwd).then(function(result) {
            if (result == true) {
              db.query('SELECT project_id, token FROM users_has_project JOIN project on users_has_project.project_id = project.id WHERE users_id = ?;', dbId, function(err, projectResult, field) {
                let projectArray = "[";
                projectResult.forEach(project => {
                  projectArray = projectArray + '[' + project.project_id + ',' + project.token + '],'
                });
                projectArray = projectArray.substring(0, projectArray.length - 1);
                projectArray = projectArray + ']'
                req.session.users_project_list = projectArray;
                req.session.user_id = dbId;
                res.status(200).json({success: 'Logged in'});
              });
            }
            else {
              res.status(403).json({error: 'Wrong credentials'});
            }
          });
        }
        else {
          throw 'Too many row with email value'; // SHOULD NEVER HAPPEND
        }
      });
    }
    catch (error) {
      res.status(400).json({error: error});
    }

  }
});

// REGISTER
router.put('/register', async (req, res, next) => {
  
  // Create Joi obj for request body information
  const schema = Joi.object({
    mail: Joi.string().email({ tlds: { allow: false }}).required(),
    name: Joi.string().min(3).required(),
    pwd: Joi.string().min(6).required()
  });

  // Validate request body information
  let result = schema.validate(req.body);

  // If request body is invalid
  if (result.error) {
    // Send 400 Status (Bad Request) + Error Details
    res.status(400).send(result.error.details[0].message);
    return;
  }
  else {
    // Check if user already exist
    db.query('SELECT email FROM users WHERE email LIKE ?;', req.body.mail, function (err, result, field) {
      if (err) {
        throw err;
      }
      else {
        // If user exist
        if (result[0]) {
          // GOTO LOGIN
          console.log(result);
          res.send('GOTO LOGIN');
        }
        else {
          // Create user
          bcrypt.hash(req.body.pwd, 10, function(err, hash) {
            try {
              db.query('INSERT INTO users SET ?', {email: req.body.mail, password: hash, name: req.body.name}, function(err, insertResult, field) {
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
      }
    });
  }
});

// UPDATE USER

// DELETE USER ?

module.exports = router;
