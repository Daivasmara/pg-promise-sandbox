const jwt = require('jsonwebtoken');

module.exports = (req, _res, next) => {
  if (!req.headers.authorization) {
    return next({
      status: 401,
      message: 'User is not authenticated.',
    });
  }

  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const { JWT_PRIVATE_KEY } = process.env;

  jwt.verify(token, JWT_PRIVATE_KEY, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};
