const config = require('../config/index');
const db = require('../models');

const connectDB = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connected = await db.mongoose.connect(
      config.localDatabaseURI,
      connectionParams
    );
    if (connected) console.log('Successfully connect to MongoDB.');
    return connected;
  } catch (error) {
    console.error('Connection error', error);
    process.exit();
  }
};

module.exports = connectDB;
