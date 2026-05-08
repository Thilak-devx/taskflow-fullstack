const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/db");
const mongoose = require("mongoose");

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);

    const server = app.listen(env.port, () => {
      console.log(`TaskFlow backend running on http://localhost:${env.port}`);
    });

    const shutdown = () => {
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
