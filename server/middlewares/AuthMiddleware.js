const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateUserToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.json({ error: "User not logged in" });
  }

  try {
    const validToken = verify(accessToken, process.env.JWTSECRET);
    req.user = validToken;
    if (validToken && req.user.role === "user") {
      return next();
    } else {
      res.json({ error: "User not authorized!" });
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

const validateAdminToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.json({ error: "User not logged in" });
  }

  try {
    const validToken = verify(accessToken, process.env.JWTSECRET);
    req.user = validToken;
    if (validToken && req.user.role === "admin") {
      return next();
    } else {
      res.json({ error: "User not authorized!" });
    }
  } catch (err) {
    return res.json({ error: err });
  }
};
module.exports = { validateUserToken, validateAdminToken };
