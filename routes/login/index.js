const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next({
      status: 401,
      message: 'Email & Password field can\'t be empty.',
    });
  }

  const { email, password } = req.body;
  const { JWT_PRIVATE_KEY } = process.env;

  try {
    const user = await db.one('SELECT * FROM users WHERE email = $1;', email);
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }

      if (!result) {
        return next({
          status: 401,
          message: 'Invalid Credentials.',
        });
      }

      return jwt.sign(user, JWT_PRIVATE_KEY, (error, token) => {
        if (error) {
          return next(error);
        }

        res.json({
          status: 'OK',
          token,
        });
      });
    });
  } catch (error) {
    next({
      status: 401,
      message: 'Invalid Credentials.',
    });
  }
});

module.exports = router;
