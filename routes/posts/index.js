const express = require('express');

const router = express.Router();
const db = require('../../db');

router.get('/', async (_req, res, next) => {
  try {
    const posts = await db.many(`
      SELECT p.id, email poster_email, first_name poster_first_name, title, body FROM posts p 
      INNER JOIN users u on p.poster_id = u.id ORDER BY p.id desc
    `);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
