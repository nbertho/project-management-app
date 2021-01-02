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

  // If user is already logged in
  if (req.session.loggedin == true) {
    res.status(409).json({error: 'You are already logged-in'});
  }
  // If user is not logged in yet
  else {
    // Verify that the request's body contains everything
    const schema = Joi.object({
      mail: Joi.string().email({ tlds: { allo: false }}).required(),
      pwd: Joi.string().min(6).required()
    })
    let result = schema.validate(req.body);
  
    // If the request's body is not correct
    if (result.error) {
      // Send 400 Status (Bad Request) + Error Details
      res.status(400).json({error: result.error.details[0].message});
      return;
    } 
    else {
      let username = req.body.mail;
      let password = req.body.pwd;
      db.query('SELECT * from users WHERE email LIKE ?;', req.body.mail, function(err, result, field) {
        if(result.length == 1) {
          let dbMail = result[0].email;
          let dbPwd = result[0].password;
          let dbId = result[0].id;
          // Check the password
          bcrypt.compare(req.body.pwd, dbPwd).then(function(result) {
            // If the password is correct
            if (result == true) {
              db.query('SELECT project_id, name, description, token FROM users_has_project JOIN project on users_has_project.project_id = project.id WHERE users_id = ?;', dbId, function(err, projectsResult, field) {      
                req.session.loggedin = true;
                req.session.username = username;
                req.session.projectList = projectsResult;
                res.status(200).json({success: 'Logged-in successfully'});
              });
            }
            else {
              // Password is incorrect
              res.status(403).json({error: 'Wrong credentials'});
            }
          });
        }
        else {
          res.status(400).json({error: 'Wrong credentials'})
        }
      });
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
