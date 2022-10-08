const jwt = require('jsonwebtoken');
const config = require('../../config/index');

const verifyToken = async (req, res, next) => {
  try {
    console.log('>>>>>>>>>>>>', req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    console.log('====>', token);
    if (!token) {
      return res.status(403).send({ message: 'No token provided!' });
    }
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('****', decoded);
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  } catch (error) {
    console.log('#######', error);
    return res.status(401).send({ message: 'Unauthorized request!' });
  }
};

module.exports = verifyToken;
