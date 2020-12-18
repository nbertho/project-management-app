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
      db.query('SELECT * from USERS WHERE email LIKE ?;', req.body.mail, function(err, result, field) {
        if(result.length ==1) {
          dbMail = result[0].email;
          dbPwd = result[0].password;
          bcrypt.compare(req.body.pwd, dbPwd).then(function(result) {
            if (result == true) {
              res.send(200).send('PASSWORD MATCH');
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
router.post('/register', async (req, res, next) => {
  
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
