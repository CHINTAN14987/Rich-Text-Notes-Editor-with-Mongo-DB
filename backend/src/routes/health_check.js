const { Router } = require('express');

const addHealthCheckRoutes = () => {
  const router = Router();
  router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Rich Text Notes.' }).end();
  });
  return router;
};

module.exports = { addHealthCheckRoutes };
