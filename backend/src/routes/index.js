const { addHealthCheckRoutes } = require('./health_check');
const { authenticationRoutes } = require('./authentication');
const { noteRoutes } = require('./note');

module.exports = { addHealthCheckRoutes, authenticationRoutes, noteRoutes };
