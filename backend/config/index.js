const dotenv = require('dotenv');
const path = require('path');

try {
  const envFound = dotenv.config({
    path: path.join(__dirname, '../.env'),
  });

  // Stop server if 'env' not found
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
} catch (error) {
  console.log(error);
}

const config = {
  port: process.env.PORT,
  database: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  databaseURI: process.env.RICH_TEXT_NOTE_DATABASE_URI,
  basePath: process.env.BASE_PATH,
  localDatabaseURI: process.env.LOCAL_DB_URI,
};

module.exports = config;
