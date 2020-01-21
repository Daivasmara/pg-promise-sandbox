const express = require('express');

const router = express.Router();
const db = require('../../db');

router.get('/', async (_req, res, next) => {
  try {
    const users = await db.many('SELECT id, first_name, last_name, email FROM users ORDER BY id desc');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.one(`
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
