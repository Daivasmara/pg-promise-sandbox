const express = require('express');
const db = require('../../db');

// middlewares
const pagination = require('../../middlewares/pagination');

const router = express.Router();

router.get('/', pagination, async (req, res, next) => {
  const { offset, limit } = req.query;
  try {
    const posts = await db.any(`
      SELECT p.id, p.title, p.body, u.email poster_email, u.first_name poster_first_name, count(*) favorites FROM posts p
      INNER JOIN users u ON p.poster_id = u.id
      INNER JOIN favorites f ON p.id = f.post_id
      GROUP BY (u.id, p.id) ORDER BY p.id DESC;
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
