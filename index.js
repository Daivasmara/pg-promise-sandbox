const express = require('express');

// middlewares
const cors = require('cors');
const morgan = require('morgan');
const authentication = require('./middlewares/authentication');

// routes
const login = require('./routes/login');
const register = require('./routes/register');
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
app.use('/register', register);
app.use('/users', authentication, users);
app.use('/posts', authentication, posts);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});
