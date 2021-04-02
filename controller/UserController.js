const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { loginRegisValidation } = require("../helper/validation");

async function createUser(req, res) {
  try {
    //Validate
    const { error } = loginRegisValidation(req.body);
    if (error) {
      const err = error.details[0].message;
      const response = {
        status: 400,
        message: err,
      };
      return res.status(400).send(response);
    }

    //Check for duplicate users
    const emailExist = await User.findOne({
      email: req.body.email,
    });
    if (emailExist) {
      const response = {
        status: 400,
        message: "Email already exist.",
      };
      return res.status(400).send(response);
    }

    //Hash password (For security)
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    //Add User
    const user = new User({
      email: req.body.email,
      password: hashPass,
    });

    const addUser = await user.save();
    const response = {
      status: 200,
      message: "Successfully registered.",
    };
    res.send(response);
  } catch (err) {
    const response = {
      status: 500,
      message: "error",
    };
    res.status(500).send(response);
  }
}

async function loginUser(req, res) {
  //Validate
  try {
    const { error } = loginRegisValidation(req.body);
    if (error) {
      const err = error.details[0].message;
      const response = {
        status: 400,
        message: err,
      };
      return res.status(400).send(response);
    }

    //Find User
    const user = await User.findOne({
      email: req.body.email,
    });

    //If not found
    if (!user) {
      const response = {
        status: 400,
        message: "Email or password invalid.",
      };
      return res.status(400).send(response);
    }

    //CheckPassword
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      const response = {
        status: 401,
        message: "Invalid Password",
      };
      return res.status(401).send(response);
    }

    //Create Token
    const token = jwt.sign({ _id: user._id }, process.env.WTT_SECRET_KEY);
    const response = {
      status: 200,
      message: "Login successfully.",
      token: token,
    };
    res.header("auth-token", token);
    res.send(response);
  } catch (err) {
    const response = {
      status: 500,
      message: "error",
    };
    res.status(500).send(response);
  }
}

module.exports = { createUser, loginUser };
