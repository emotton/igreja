const jwt = require("jsonwebtoken");

module.exports = {
  verifyJWT: function (req, res, next) {
    const token = req.headers["authorization"];

    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });

    jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .json({ auth: false, message: "Failed to authenticate token." });

      // se tudo estiver ok, salva no request para uso posterior
      if (decoded.type !== "access") {
        return res
          .status(500)
          .json({
            auth: false,
            message: "Failed to authenticate token. [Refresh]",
          });
      }
      req.userId = decoded.id;
      next();
    });
  },
};
