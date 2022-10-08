const bcrypt = require('bcryptjs');
const { addUser: addUserService } = require('../services/User');

const addUser = async (req, res) => {
  const { body } = req;
  console.log('Calling addUser controller with body: ', body);
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await addUserService({ ...body, password: hashedPassword });
    if (user) {
      return res.status(200).send({
        isUserRegister: true,
        message: 'User Registered Successfully!',
      });
    }
  } catch (error) {
    console.log('Something went wrong while adding user: ', error);
    return res
      .status(501)
      .send({ isUserRegister: false, message: 'Internal Sever Error!' });
  }
};

module.exports = {
  addUser,
};
