const express = require('express');

const router = express.Router();
const db = require('../../db');

router.get('/', async (_req, res) => {
  const users = await db.query('select * from users order by id desc');
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await db.query('select u.*, coalesce(json_agg(json_build_object(\'title\', p.title, \'body\', p.body) order by p.id desc) filter (where p.title is not null), \'[]\') posts from users u left join posts p on u.id = p.poster_id where u.id = $1 group by u.id', [req.params.id]);
  res.json(user);
});

module.exports = router;
