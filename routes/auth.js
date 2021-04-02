const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    const response = {
      status: 401,
      message: "Unauthorized, Request need token.",
    };
    return res.status(401).send(response);
  }

  try {
    const verified = jwt.verify(token, process.env.WTT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    const response = {
      status: 401,
      message: "Invalid Token.",
    };
    res.status(401).send(response);
  }
};
