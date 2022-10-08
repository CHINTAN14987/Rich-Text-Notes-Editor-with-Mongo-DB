const express = require('express');
const cors = require('cors');
const config = require('../config');
const routes = require('./routes');
const connectDB = require('../db/connect');

const { json, urlencoded } = express;

const app = express();
const corsOption = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOption));

// Routes
const healthCheckRoutes = routes.addHealthCheckRoutes();
const authenticationRoutes = routes.authenticationRoutes();
const noteRoutes = routes.noteRoutes();

// parse request of content-type - application/json
app.use(json());

// parse request of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

app.use('/', healthCheckRoutes);
app.use(config.basePath, authenticationRoutes);
app.use(config.basePath, noteRoutes);

//set the port and listen for requests
const PORT = config.port || 8082;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}....`);
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

start();
