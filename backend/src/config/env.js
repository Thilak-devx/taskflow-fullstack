const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const parseList = (value, fallback = "") =>
  (value || fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseOrigins = (value) => parseList(value, "http://localhost:5173");

const parseRegexList = (value) =>
  parseList(value).map((pattern) => {
    try {
      return new RegExp(pattern);
    } catch (_error) {
      throw new Error(`Invalid CORS_ORIGIN_REGEX pattern: ${pattern}`);
    }
  });

const rawDatabaseUrl = process.env.DATABASE_URL || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: rawDatabaseUrl,
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrls: parseOrigins([process.env.CLIENT_URL, process.env.CLIENT_URLS].filter(Boolean).join(",")),
  corsOriginRegexes: parseRegexList(process.env.CORS_ORIGIN_REGEX || ""),
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  logLevel: process.env.LOG_LEVEL || "info"
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI or DATABASE_URL is required.");
}

if (!/^mongodb(\+srv)?:\/\//.test(env.mongoUri)) {
  throw new Error("TaskFlow backend currently supports MongoDB connection strings only.");
}

if (!env.jwtSecret || (env.nodeEnv === "production" && env.jwtSecret === "change-me-in-production")) {
  throw new Error("A secure JWT_SECRET is required.");
}

if (env.jwtSecret.length < 16) {
  throw new Error("JWT_SECRET must be at least 16 characters long.");
}

if (!Number.isInteger(env.bcryptSaltRounds) || env.bcryptSaltRounds < 10 || env.bcryptSaltRounds > 14) {
  throw new Error("BCRYPT_SALT_ROUNDS must be an integer between 10 and 14.");
}

module.exports = env;
