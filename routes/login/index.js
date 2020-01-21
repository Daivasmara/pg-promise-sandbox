const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  if (req.body.email && req.body.password) {
    const { email, password } = req.body;
    const { JWT_PRIVATE_KEY } = process.env;
    try {
      const user = await db.one('SELECT * FROM users WHERE email = $1', [email]);
      bcrypt.compare(password, user.password, (err, result) => {
        if (!err) {
          if (result) {
            jwt.sign(user, JWT_PRIVATE_KEY, (error, token) => {
              if (!error) {
                res.json({
                  token,
                });
              } else {
                next(error);
              }
            });
          } else {
            next({
              status: 401,
              message: 'Invalid Credentials.',
            });
          }
        } else {
          next(err);
        }
      });
    } catch (error) {
      next({
        status: 401,
        message: 'Invalid Credentials.',
      });
    }
  } else {
    next({
      status: 401,
      message: 'Email & Password field can\'t be empty.',
    });
  }
});

module.exports = router;
