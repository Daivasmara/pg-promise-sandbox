const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  if (
    !req.body.firstName
    || !req.body.lastName
    || !req.body.email
    || !req.body.password
    || !req.body.confirmPassword
  ) {
    return next({
      status: 401,
      message: 'Fields can\'t be empty.',
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return next({
      status: 401,
      message: '\'Password\' and \'Confirm Password\' fields are not equal',
    });
  }

  try {
    const isEmailExist = await db.any('SELECT id from users WHERE email = $1', email);
    if (isEmailExist.length !== 0) {
      return next({
        status: 401,
        message: 'Email already registered.',
      });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      const user = {
        first_name: firstName,
        last_name: lastName,
        email,
      };

      if (err) {
        return next(err);
      }

      db.none(`INSERT INTO users (first_name, last_name, email, password) VALUES 
        ($<user.first_name>, $<user.last_name>, $<user.email>, $<hash>);`, {
        user,
        hash,
      })
        .then(() => res.json({
          status: 'OK',
          result: [user],
        }))
        .catch((error) => next(error));
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
