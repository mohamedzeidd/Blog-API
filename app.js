const express = require("express");
const app = express();
const AppError = require("./utils/appError");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const authController = require("./controllers/authController");
const globalHandleError = require("./controllers/errorController");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const hpp = require("hpp");

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize());

//Serving static files
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(cookieParser());
app.use(helmet());
app.use(xss());

app.use(
  hpp({
    whitelist: ["numOfLikes", "numOfComments"],
  })
);

app.use((req, res, next) => {
  console.log(`📢 Incoming request: ${req.method} ${req.path}`);
  next();
});
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);

app.use((req, res, next) => {
  return next(
    new AppError(
      `The requested URL ${req.originalUrl} was not found on this server.`
    )
  );
});

app.use(globalHandleError);

module.exports = app;
