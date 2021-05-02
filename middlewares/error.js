module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTOkenError") {
    return res.status(401).json({ message: err.message });
  }
  res.status(500).json({ message: err.message });
};
