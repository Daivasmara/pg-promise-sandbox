const express = require('express');

const router = express.Router();
const db = require('../../db');

router.get('/', async (_req, res, next) => {
  try {
    const users = await db.many('SELECT * FROM users ORDER BY id desc');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.one(`
        SELECT u.*, COALESCE(JSON_AGG(JSON_BUILD_OBJECT('title', p.title, 'body', p.body) ORDER BY p.id DESC) 
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
