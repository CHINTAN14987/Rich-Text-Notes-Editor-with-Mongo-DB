const db = require('../../models');

const Users = db.users;

const getUserByEmail = async (email) => {
  try {
    console.log('Calling getUserByEmail Service :', email);
    const user = await Users.findOne({
      email,
    });
    return user || null;
  } catch (error) {
    console.log('error: ', error);
  }
};

const addUser = async (body) => {
  try {
    console.log('Calling createNewUser Service :', body);
    const user = await new Users(body).save();
    return user;
  } catch (error) {
    console.log('error: ', error);
  }
};

module.exports = { getUserByEmail, addUser };
