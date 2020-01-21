const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  if (
    req.body.firstName
    && req.body.lastName
    && req.body.email
    && req.body.password
    && req.body.confirmPassword) {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;
    if (password === confirmPassword) {
      try {
        const isEmailExist = await db.any('SELECT * from users WHERE email = $1', [email]);
        if (isEmailExist.length === 0) {
          bcrypt.hash(password, 10, (err, hash) => {
            const user = {
              first_name: firstName,
              last_name: lastName,
              email,
            };
            if (!err) {
              db.none(`INSERT INTO users (
                first_name, last_name, email, password
              ) VALUES (
                $<user.first_name>, $<user.last_name>, $<user.email>, $<hash>
              );`, {
                user,
                hash,
              })
                .then(() => res.json({
                  status: 'SUCESS',
                  result: [user],
                }))
                .catch((error) => next(error));
            } else {
              next(err);
            }
          });
        } else {
          next({
            status: 401,
            message: 'Email already registered.',
          });
        }
      } catch (err) {
        next(err);
      }
    } else {
      next({
        status: 401,
        message: '\'Password\' and \'Confirm Password\' fields are not equal',
      });
    }
  } else {
    next({
      status: 401,
      message: 'Fields can\'t be empty.',
    });
  }
});

module.exports = router;
