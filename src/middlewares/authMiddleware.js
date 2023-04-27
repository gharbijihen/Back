const db = require("../models");
const User = db.User;

const checkDuplicateEmail = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        status: "error",
        message: "Failed! Email is already in use!",
      });
      return;
    }

    next();
  });
};
const checkPasswordConfirmation = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).send({
      status: "error",
      message: `vérifier votre confirmation mot de passe`,
    });

  next();
};

const checkMissingFields = (req, res, next) => {
  // confirmPassword
  const {
    firstName,
    lastName,
    email,
    contact,
    password,
    confirmPassword,
    confirmation_token,
  } = req.body;

  if (
    (!firstName || !lastName || !email || !password,
    !contact || !confirmPassword,
    confirmation_token)
  )
    return res.status(400).send({
      status: "error",
      message: `Missing fields`,
    });

  next();
};

module.exports = {
  checkDuplicateEmail,
  checkMissingFields,
  checkPasswordConfirmation,
};
