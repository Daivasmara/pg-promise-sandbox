const express = require('express');
const db = require('../../db');

// middlewares
const pagination = require('../../middlewares/pagination');

const router = express.Router();

router.get('/', pagination, async (req, res, next) => {
  const { offset, limit } = req.headers;
  try {
    const posts = await db.any(`
      SELECT p.id, email poster_email, first_name poster_first_name, title, body FROM posts p 
      INNER JOIN users u on p.poster_id = u.id ORDER BY p.id DESC OFFSET $1 LIMIT $2;
    `, [offset, limit]);
    const { count } = await db.one('SELECT count(*) from posts;');

    res.json({
      nTotal: Number(count),
      totalPages: Math.ceil(count / limit),
      result: posts,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
