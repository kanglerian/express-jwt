const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { Users } = require('../models');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken
      }
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user.id;
      const userUsername = user.username;
      const userEmail = user.email;
      const accessToken = jwt.sign({ userId, userUsername, userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
