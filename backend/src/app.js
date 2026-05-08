const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const setupSwagger = require("./config/swagger");
const ApiError = require("./utils/ApiError");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const { apiLimiter, authLimiter } = require("./middleware/rateLimitMiddleware");

const app = express();

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (env.clientUrls.includes(origin) || env.corsOriginRegexes.some((pattern) => pattern.test(origin))) {
    return true;
  }

  if (!env.allowVercelPreviewOrigins) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.protocol === "https:" && parsedOrigin.hostname.endsWith(".vercel.app");
  } catch (_error) {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new ApiError(403, "Origin is not allowed by CORS."));
    },
    credentials: false,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.set("trust proxy", 1);
app.use(apiLimiter);
app.use(["/api/v1/auth", "/api/auth"], authLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "TaskFlow API is running."
  });
});

setupSwagger(app);
app.use("/api/v1", routes);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
