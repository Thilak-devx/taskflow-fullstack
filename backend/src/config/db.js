const mongoose = require("mongoose");

const connectDatabase = async (mongoUri) => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== "production",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000
  });
};

module.exports = connectDatabase;
