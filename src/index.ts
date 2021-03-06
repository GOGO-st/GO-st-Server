import express from "express";
import config from "./config";
import connectDB from "./loader/db";
import { logger } from "./modules/logger";
import helmet from "helmet";

const app = express();

// Connect Database
connectDB();

// Security
app.use(helmet());

// Client
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define Routes
app.use("/users", require("./api/user"));
app.use("/reviews", require("./api/review"));
app.use("/maps", require("./api/map"));
app.use("/geo", require("./api/geo"));

// error handler
app.use(function (err, req, res, next) {
  logger.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.message,
  });
});

app
  .listen(config.port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
  })
  .on("error", err => {
    console.error(err);

    process.exit(1);
  });
