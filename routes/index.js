require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Users } = require('../models');

/* POST login. */
router.post('/', async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: 'Password salah' });
    const userId = user.id;
    const userUsername = user.username;
    const userEmail = user.email;
    const accessToken = jwt.sign({ userId, userUsername, userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
    const refreshToken = jwt.sign({ userId, userUsername, userEmail }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    await Users.update({ refresh_token: refreshToken }, {
      where: {
        id: userId
      }
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    });
    res.json({ accessToken })
  } catch (error) {
    res.status(404).json({ msg: 'Email tidak ditemukan.' })
  }
});

module.exports = router;
