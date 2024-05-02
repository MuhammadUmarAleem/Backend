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

var SignUpRouter = require("./routes/SignUp");
var LoginRouter = require("./routes/Login");
var BotRouter = require("./routes/Bot");
var GetBotDateRouter = require("./routes/GetBotDate");
var GetLatestWithdrawalsRouter = require("./routes/GetLatestWithdrawals");
var GetUserDataRouter = require("./routes/GetUserData");
var GetAllBotsRouter = require("./routes/GetAllBots");
var DeleteBotRouter = require("./routes/DeleteBot");
var WithdrawRouter = require("./routes/Withdraw");
var GetWithdrawHistoryRouter = require("./routes/GetWithdrawHistory");
var GetAdminWithdrawRouter = require("./routes/GetAdminWithdraw");
var AddPositionsRouter = require("./routes/AddPositions");
var GetPositionsRouter = require("./routes/GetPositions");
var DeletePositionRouter = require("./routes/DeletePosition");
var GetBalanceRouter = require("./routes/GetBalance");
var UpdateBalanceRouter = require("./routes/UpdateBalance");
var GetUserPositionRouter = require("./routes/GetUserPosition");
var GetCoinRouter = require("./routes/GetCoin");
var UpdateCoinRouter = require("./routes/UpdateCoin");

const { info } = require("console");

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
app.use("/SignUp", SignUpRouter);
app.use("/Login", LoginRouter);
app.use("/Bot", BotRouter);
app.use("/GetBotDate", GetBotDateRouter);
app.use("/GetLatestWithdrawals", GetLatestWithdrawalsRouter);
app.use("/GetUserData", GetUserDataRouter);
app.use("/GetAllBots", GetAllBotsRouter);
app.use("/DeleteBot", DeleteBotRouter);
app.use("/Withdraw", WithdrawRouter);
app.use("/GetWithdrawHistory", GetWithdrawHistoryRouter);
app.use("/GetAdminWithdraw", GetAdminWithdrawRouter);
app.use("/AddPositions", AddPositionsRouter);
app.use("/GetPositions", GetPositionsRouter);
app.use("/DeletePosition", DeletePositionRouter);
app.use("/GetBalance", GetBalanceRouter);
app.use("/UpdateBalance", UpdateBalanceRouter);
app.use("/GetUserPosition", GetUserPositionRouter);
app.use("/GetCoin", GetCoinRouter);
app.use("/UpdateCoin", UpdateCoinRouter);


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





const cron = require('node-cron');
const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
});

// Function to generate random user names with three characters from 'a' to 'z'
const generateRandomUserName = () => {
  let prefix = '';
  for (let i = 0; i < 3; i++) {
      const randomCharCode = Math.floor(Math.random() * 26) + 97; // Generate a random character code from 'a' to 'z'
      prefix += String.fromCharCode(randomCharCode); // Convert the character code to a character and append to the prefix
  }
  const suffix = Math.floor(Math.random() * 10000); // Generate a random 4-digit number
  return `${prefix}****${suffix}`; // Combine prefix, asterisks, and suffix
};


// Function to generate random amount
const generateRandomAmount = () => {
    return (Math.random() * 1000).toFixed(2); // Generate a random amount between 0 and 1000 with 2 decimal places
};

// Function to insert random data into the temp table
const insertRandomData = () => {
    const user = generateRandomUserName();
    const amount = generateRandomAmount();

    const sql = 'INSERT INTO Temp (User, Amount) VALUES (?, ?)';
    const values = [user, amount];

    pool.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Inserted random data successfully:', results.insertId);
        }
    });
};

// Function to remove the row with the minimum Id from the temp table
const removeRowWithMinId = () => {
  const sql = 'DELETE FROM Temp WHERE Id = (SELECT Id FROM (SELECT MIN(Id) AS Id FROM Temp) AS temp)';
  pool.query(sql, (error, results) => {
      if (error) {
          console.error('Error removing row:', error);
      } else {
          console.log('Removed row with minimum Id successfully');
      }
  });
};


// Schedule the tasks to run after one second
cron.schedule('*/5 * * * * *', () => {
    insertRandomData();
    removeRowWithMinId();
    console.log('Tasks executed at:', new Date());
});






module.exports = app;
