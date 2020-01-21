const jwt = require('jsonwebtoken');

module.exports = (req, _res, next) => {
  if (req.headers.authorization) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { JWT_PRIVATE_KEY } = process.env;

    jwt.verify(token, JWT_PRIVATE_KEY, (err) => {
      if (!err) {
        next();
      } else {
        next(err);
      }
    });
  } else {
    next({
      status: 401,
      message: 'User is not authenticated.',
    });
  }
};
