const { verifyToken } = require('./authJwt');
const { verifySignUp } = require('./verifySignUp');

module.exports = { verifyToken, verifySignUp };
