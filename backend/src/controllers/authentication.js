const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../services/User');
const config = require('../../config');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Calling login controller with body: ', req.body);
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).send({ message: 'User not found!' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .send({ message: 'Please Check your Email or Password' });
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const accessToken = jwt.sign(tokenPayload, config.jwtSecret);
    return res
      .status(200)
      .send({ accessToken, message: 'Login Successfully!' });
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = { login };
