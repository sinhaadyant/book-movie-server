const userLib = require("../lib/user");
function authenticationMiddlware() {
  return function (req, res, next) {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"];

    if (authHeader) {
      const headerSplit = authHeader.split("Bearer ");
      if (headerSplit.length == 2) {
        const token = headerSplit[1];
        const validateTokenResult = userLib.validateUserToken(token);
        if (validateTokenResult) {
          req.user = validateTokenResult;
        }
      }
    }
    next();
  };
}
function ensureAuthenticated({ allowedRoles = null }) {
  return function (req, res, next) {
    const user = req.user;
    if (!user)
      return res
        .status(401)
        .json({ status: "error", error: "UnAuthenticated" });
    if (!allowedRoles.includes(user.role))
      return res.status(401).json({ status: "error", error: "Access Denied" });

    return next();
  };
}
module.exports = { authenticationMiddlware, ensureAuthenticated };
