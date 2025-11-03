const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // const { token } = req.cookie;

  let token = req.headers.authorization;
  token = token.split(" ")[1];
  // console.log("JWT_TOKEN", token);

  if (!token) {
    // token not present
    return res.status(401).json({
      success: false,
      status: "error",
      code: "UNAUTHORISED_USER",
      message: "User not authorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token

    req.user = decoded.user; // attach user info
    next(); // call the next fnx
  } catch (err) {
    console.log({ type: "Auth", error: err.message });
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong try again !",
      },
    });
  }
};

module.exports = { authMiddleware };
