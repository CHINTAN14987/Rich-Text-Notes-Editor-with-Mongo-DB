const { Router } = require('express');
const { addUser } = require('../controllers/user');
const { verifySignUp } = require('../middlewares');
const { login } = require('../controllers/authentication');

const authenticationRoutes = function () {
  const router = Router();
  router.post('/signup', verifySignUp, addUser);
  router.post('/', login);
  return router;
};

module.exports = {
  authenticationRoutes,
};
