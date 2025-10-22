const UserModel = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// signup or register api for user
const signup = async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log("SIGNUP_BODY", req.body);
  // if the user credential not provided
  if (!name.trim() && !email.trim() && !password.trim()) {
    res.status(400).json({
      success: false,
      error: {
        code: "CREDENTIAL_NOT_PROVIDED",
        message: "Provide username or email and password",
      },
    });
  }
  try {
    // check if user already exist
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        error: { code: "USER_ALREADY_EXIST", message: "User already exist" },
      });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      let newUser = new UserModel({
        name: name,
        email: email,
        password: hashed,
        pic,
      });
      await newUser.save();

      // generating token for new user
      const token = jwt.sign({ user: newUser }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      console.log("token", token);

      newUser = newUser.toObject();
      delete newUser.password;
      newUser.token = token;

      return res.status(201).json({
        success: true,
        message: "Account created Successfully",
        user: newUser,
      });
    }
  } catch (err) {
    console.log({ type: "SIGNUP_API", error: err.message });
    res.status(500).json({
      success: false,
      status: "error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong try again !",
      },
    });
  }
};

// login api for existing user
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email.trim() && !password.trim()) {
    // check for credentials to login
    res.status(400).json({
      success: false,
      error: {
        code: "CREDENTIAL_NOT_PROVIDED",
        message: "Provide username or email and password",
      },
    });
  }

  try {
    // check if such user exist
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: "error",
        code: "USER_NOT_FOUND",
        message: "No such user found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // if passowrd doesn't match
    if (!isMatch)
      return res.status(401).json({
        success: false,
        status: "error",
        code: "INVALID ID_PASSWORD",
        message: "Email or Password is wrong",
      });

    // generating token while login
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user = user.toObject();
    delete user.password;
    user.token = token;

    return res.status(201).json({
      success: true,
      status: "Success",
      message: "Logged in successfully",
      user: user,
    });
  } catch (err) {
    console.log({ type: "LOGIN_API", error: err.message });
    return res.status(500).json({
      success: false,
      status: "error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong try again !",
      },
    });
  }
};

//  /user?search
const getAllUsers = async (req, res) => {
  console.log("req", req.query);

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const user = await UserModel.find(keyword);
  console.log(user);

  res.status(200).json({
    success: true,
    status: "success",
    data: user,
    message: "Users fetched successfully",
  });
};

module.exports = { signup, login, getAllUsers };
