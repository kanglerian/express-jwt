const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const verifyToken = require('../middlewares/verifyToken');
const { Users } = require('../models');

/* GET users listing. */
router.get('/', verifyToken, async (req, res) => {
  const users = await Users.findAll({
    attributes: ['id', 'username', 'email'],
  });
  res.json(users);
});

/* POST new user. */
router.post('/', async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: 'Password tidak sama.' })
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  await Users.create({
    username: username,
    email: email,
    password: hashPassword
  });
  res.status(200).json({
    msg: 'Registrasi berhasil!'
  });
});


module.exports = router;
