const { getUserByEmail } = require('../services/User');

const verifySignUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const User = await getUserByEmail(email);
    if (User) {
      res.status(400).send({
        isUserRegister: false,
        message: 'Email is already in use!',
      });
      return;
    }
  } catch (error) {
    console.log('Something went wrong while verifying user: ', error);
    res.status(500).send({
      isUserRegister: false,
      message: 'Internal Sever Error!',
    });
    return;
  }
  next();
};

module.exports = { verifySignUp };
