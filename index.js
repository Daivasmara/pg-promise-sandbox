const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const login = require('./routes/login');
const users = require('./routes/users');
const posts = require('./routes/posts');

const app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const { PORT } = process.env;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App is listening on port ${PORT}...`));

app.get('/', (_req, res) => {
  res.json({
    message: 'BLOG-API',
  });
});

app.use('/login', login);
app.use('/users', users);
app.use('/posts', posts);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});
