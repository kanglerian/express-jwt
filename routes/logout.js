const express = require('express');
const router = express.Router();

const { Users } = require('../models');

router.delete('/', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findOne({
    where: {
      refresh_token: refreshToken
    }
  });
  if (!user) return res.sendStatus(204);
  const userId = user.id
  await Users.update({
    refresh_token: null
  },{
    where: {
      id: userId
    }
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
})

module.exports = router;
