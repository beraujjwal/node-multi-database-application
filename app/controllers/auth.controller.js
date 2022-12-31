const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../models/sequelize");
const User = mysql.user;
const Role = mysql.role;
const Op = mysql.Op;

const MUser = require('../models/user.mongoose');

exports.signup = (req, res) => {
  // Save user to database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      const newUser = new MUser({
        email: user.email,
        username: user.username,
        password: user.password,
        createdAt: '2022-12-30T11:12:13.494+00:00',
        updatedAt: '2022-12-30T14:15:16.494+00:00'
      });
      newUser.save(function (err) {
        if(err) {
          console.log(err);
          res.send({ message: "Unable to register the new user!" });
        } else {
          res.send({ message: "User was registered successfully!" });
        }
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: 86400 // 24 hours
      });

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
