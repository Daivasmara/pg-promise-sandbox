const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db');

// middlewares
const pagination = require('../../middlewares/pagination');

const router = express.Router();

router.get('/', pagination, async (req, res, next) => {
  const { offset, limit } = req.headers;
  try {
    const users = await db.any('SELECT id, first_name, last_name, email FROM users ORDER BY id DESC OFFSET $1 LIMIT $2', [offset, limit]);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const { JWT_PRIVATE_KEY } = process.env;
  jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
    if (!err) {
      res.json(decoded);
    } else {
      next(err);
    }
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.any(`
        SELECT u.id, u.first_name, u.last_name, u.email, COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'title', p.title, 'body', p.body) ORDER BY p.id DESC) 
        FILTER (WHERE p.title IS NOT NULL), '[]') posts 
        FROM users u LEFT JOIN posts p on u.id = p.poster_id 
        WHERE u.id = $1 GROUP BY u.id
      `, [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
