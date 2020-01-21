module.exports = (req, _res, next) => {
  if (!req.headers.offset) {
    req.headers.offset = 0;
  }
  if (!req.headers.limit) {
    req.headers.limit = 10;
  }
  next();
};
