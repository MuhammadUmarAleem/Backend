var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./utils/database");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes");

var registerRouter = require("./routes/register");
var forgotpasswordRouter = require("./routes/forgotpassword");
var GetProfileRouter = require("./routes/GetProfile");
var loginRouter = require("./routes/login");
var UpdateProfileRouter = require("./routes/UpdateProfile");
var SubscribeRouter = require("./routes/Subscribe");
var GetUsersRouter = require("./routes/GetUsers");
var LotteryRouter = require("./routes/Lottery");
var GetLotteryRouter = require("./routes/GetLottery");
var GetPlansRouter = require("./routes/GetPlans");
var UpdateUserRouter = require("./routes/UpdateUser");
var DeleteUserRouter = require("./routes/DeleteUser");
var AdminLoginRouter = require("./routes/AdminLogin");
var PlanRouter = require("./routes/Plan");
const { info } = require("console");
const { GetUsers } = require("./controller/GetUsers");

var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// function validateAPIKey(req, res, next) {
//   const authkey =  req.header('api-key');
//   if (authkey && crypto.createHash('sha256').update(authkey).digest('hex') == process.env.API_KEY) {
//     next();
//   } else {
//     res.status(401).json({ error: 'Unauthorized Access' });
//   }
// }
// app.use((req, res, next) => {
//   if (req.path.startsWith('/images')) {
//     return next();
//   }
//   validateAPIKey(req, res, next);
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("", usersRouter);
// Users
app.use("/register", registerRouter);
app.use("/forgotpassword", forgotpasswordRouter);
app.use("/GetProfile", GetProfileRouter);
app.use("/login", loginRouter);
app.use("/GetUsers", GetUsersRouter);
app.use("/UpdateProfile", UpdateProfileRouter);
app.use("/GetPlans", GetPlansRouter);
app.use("/Subscribe", SubscribeRouter);
app.use("/Plan", PlanRouter);
app.use("/DeleteUser", DeleteUserRouter);
app.use("/AdminLogin", AdminLoginRouter);
app.use("/updateUser", UpdateUserRouter);
app.use("/GetLottery", GetLotteryRouter);
app.use("/Lottery", LotteryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
