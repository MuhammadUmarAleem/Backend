var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./utils/database");
const axios = require("axios");
const cron = require("node-cron");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes");

var SignUpRouter = require("./routes/SignUp");
var LoginRouter = require("./routes/Login");
var GetEventsRouter = require("./routes/GetEvents");
var AddEventRouter = require("./routes/AddEvent");
var GetLocationsRouter = require("./routes/GetLocations");
var VerifyRouter = require("./routes/Verify");
var GetEventDetailRouter = require("./routes/GetEventDetail");
var GetProfileRouter = require("./routes/GetProfile");
var EditProfileRouter = require("./routes/EditProfile");
var ChangePasswordRouter = require("./routes/ChangePassword");
var GetSocialMediaRouter = require("./routes/GetSocialMedia");
var EditSocialRouter = require("./routes/EditSocial");
var AddChatRouter = require("./routes/AddChat");
var GetChatRouter = require("./routes/GetChat");
var AddMessageRouter = require("./routes/AddMessage");
var GetMessagesRouter = require("./routes/GetMessages");
var RequestToJoinRouter = require("./routes/RequestToJoin");
var GetEventIdsRequestRouter = require("./routes/GetEventIdsRequest");
var GetRequestsRouter = require("./routes/GetRequests");
var UpdateRequestStatusRouter = require("./routes/UpdateRequestStatus");
var GetEventUsersRouter = require("./routes/GetEventUsers");

var AdminSignInRouter = require("./routes/Admin/SignIn");
var AdminGetEventsRouter = require("./routes/Admin/GetEvents");
var AdminGetDashboardUsersRouter = require("./routes/Admin/GetDashboardUsers");
var AdminGetUsersRouter = require("./routes/Admin/GetUsers");
var AdminEditUserRouter = require("./routes/Admin/EditUser");
var AdminDeleteUserRouter = require("./routes/Admin/DeleteUser");
var AdminTemporaryDeactivateUserRouter = require("./routes/Admin/TemporaryDeactivateUser");
var AdminActiveTemporaryDeactivatedUserRouter = require("./routes/Admin/ActiveTemporaryDeactivatedUser");
var AdminPermanentDeactivateUserRouter = require("./routes/Admin/PermanentDeactivateUser");
var AdminDeleteEventRouter = require("./routes/Admin/DeleteEvent");
var AdminUpdateEventRouter = require("./routes/Admin/UpdateEvent");
var AdminGetDashboardEventsRouter = require("./routes/Admin/GetDashboardEvents");
var GetDashboardRouter = require("./routes/Admin/GetDashboard");
var AdminUpdatePasswordRouter = require("./routes/Admin/UpdatePassword");
var AdminGetEventRouter = require("./routes/Admin/GetEvent");
var AdminGetAnalyticsDataRouter = require("./routes/Admin/GetAnalyticsData");
var AdminGetPostsDataRouter = require("./routes/Admin/GetPostsData");
var AdminGetUsersByCountryRouter = require("./routes/Admin/GetUsersByCountry");

const { info } = require("console");

var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
app.use("/AddEvent", AddEventRouter);
app.use("/GetEvents", GetEventsRouter);
app.use("/GetLocations", GetLocationsRouter);
app.use("/Verify", VerifyRouter);
app.use("/GetEventDetail", GetEventDetailRouter);
app.use("/GetProfile", GetProfileRouter);
app.use("/EditProfile", EditProfileRouter);
app.use("/ChangePassword", ChangePasswordRouter);
app.use("/GetSocialMedia", GetSocialMediaRouter);
app.use("/EditSocial", EditSocialRouter);
app.use("/AddChat", AddChatRouter);
app.use("/GetChat", GetChatRouter);
app.use("/AddMessage", AddMessageRouter);
app.use("/GetMessages", GetMessagesRouter);
app.use("/RequestToJoin", RequestToJoinRouter);
app.use("/GetEventIdsRequest", GetEventIdsRequestRouter);
app.use("/GetRequests", GetRequestsRouter);
app.use("/UpdateRequestStatus", UpdateRequestStatusRouter);
app.use("/GetEventUsers", GetEventUsersRouter);

// Admin
app.use("/Admin/SignIn", AdminSignInRouter);
app.use("/Admin/GetEvents", AdminGetEventsRouter);
app.use("/Admin/GetDashboardUsers", AdminGetDashboardUsersRouter);
app.use("/Admin/GetUsers", AdminGetUsersRouter);
app.use("/Admin/EditUser", AdminEditUserRouter);
app.use("/Admin/DeleteUser", AdminDeleteUserRouter);
app.use("/Admin/TemporaryDeactivateUser", AdminTemporaryDeactivateUserRouter);
app.use("/Admin/ActiveTemporaryDeactivatedUser", AdminActiveTemporaryDeactivatedUserRouter);
app.use("/Admin/PermanentDeactivateUser", AdminPermanentDeactivateUserRouter);
app.use("/Admin/DeleteEvent", AdminDeleteEventRouter);
app.use("/Admin/UpdateEvent", AdminUpdateEventRouter);
app.use("/Admin/GetDashboardEvents", AdminGetDashboardEventsRouter);
app.use("/Admin/GetDashboard", GetDashboardRouter);
app.use("/Admin/UpdatePassword", AdminUpdatePasswordRouter);
app.use("/Admin/GetEvent", AdminGetEventRouter);
app.use("/Admin/AnalyticsData", AdminGetAnalyticsDataRouter);
app.use("/Admin/GetPostsData", AdminGetPostsDataRouter);
app.use("/Admin/GetUsersByCountry", AdminGetUsersByCountryRouter);

// Schedule the task to run every day at 7:46 AM UTC (which is 12:46 PM PST)
cron.schedule("52 12 * * *", async () => {
  try {
    const response = await axios.put("http://localhost:4000/Admin/ActiveTemporaryDeactivatedUser");
    console.log("Cron job executed successfully at 12:52 PM PST", response.data);
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});


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
