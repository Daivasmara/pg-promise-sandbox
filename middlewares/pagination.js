module.exports = (req, _res, next) => {
  if (!req.query.offset) {
    req.query.offset = 0;
  }
  if (!req.query.limit) {
    req.query.limit = 10;
  }
  next();
};
