const express = require('express');

const router = express.Router();
const db = require('../../db');

router.get('/', async (_req, res, next) => {
  try {
    const users = await db.many('select * from users order by id desc');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.one(`
        select u.*, coalesce(json_agg(json_build_object('title', p.title, 'body', p.body) order by p.id desc) 
        filter (where p.title is not null), '[]') posts 
        from users u left join posts p on u.id = p.poster_id 
        where u.id = $1 group by u.id
      `, [req.params.id]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
