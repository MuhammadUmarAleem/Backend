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

var AdminAddEmployeeRouter = require("./routes/SuperAdmin/AdminAddEmployee");
var LoginRouter = require("./routes/Login");
var GetEmployeesRouter = require("./routes/GetEmployees");
var GetEmployeesUsingIdRouter = require("./routes/GetEmployeesUsingId");
var UpdateEmployeeRouter = require("./routes/SuperAdmin/UpdateEmployee");
var DeleteEmployeeRouter = require("./routes/SuperAdmin/DeleteEmployee");
var CreateTeamRouter = require("./routes/SuperAdmin/CreateTeam");
var UpdateTeamRouter = require("./routes/SuperAdmin/UpdateTeam");
var GetTeamsRouter = require("./routes/GetTeams");
var GetTeamRouter = require("./routes/GetTeam");
var AddAdminRouter = require("./routes/SuperAdmin/AddAdmin");
var GetAdminsRouter = require("./routes/GetAdmins");
var UpdateAdminRouter = require("./routes/SuperAdmin/UpdateAdmin");
var GetProjectsRouter = require("./routes/GetProjects");
var GetProjectRouter = require("./routes/GetProject");
var DeleteProjectRouter = require("./routes/SuperAdmin/DeleteProject");
var GetRequestsRouter = require("./routes/GetRequests");
var DeleteLeaveRequestRouter = require("./routes/SuperAdmin/DeleteLeaveRequest");
var UpdateLeaveRequestRouter = require("./routes/SuperAdmin/UpdateLeaveRequest");
var GetAttendanceRouter = require("./routes/GetAttendance");
var CreateProjectRouter = require("./routes/Admin/CreateProject");
var UpdateProjectRouter = require("./routes/Admin/UpdateProject");
var DeleteAProjectRouter = require("./routes/Admin/DeleteAProject");
var AssignProjectRouter = require("./routes/ProjectManager/AssignProject");
var CreateTicketRouter = require("./routes/ProjectManager/CreateTicket");
var GetTicketsRouter = require("./routes/GetTickets");
var GetTicketRouter = require("./routes/GetTicket");
var CreateCommentRouter = require("./routes/ProjectManager/CreateComment");
var GetCommentsRouter = require("./routes/GetComments");
var UpdateLeaveRequest1Router = require("./routes/ProjectManager/UpdateLeaveRequest1");
var GetStatsRouter = require("./routes/GetStats");
var StartTimerRouter = require("./routes/Employee/StartTimer");
var StopTimerRouter = require("./routes/Employee/StopTimer");
var GetAssignedTicketsRouter = require("./routes/GetAssignedTickets");
var GetAssignedTicketRouter = require("./routes/GetAssignedTicket");
var CompletionRequestRouter = require("./routes/Employee/CompletionRequest");
var UpdateProfileRouter = require("./routes/Employee/UpdateProfile");
var CreateLeaveRequestRouter = require("./routes/Employee/CreateLeaveRequest");
var DeleteTeamRouter = require("./routes/SuperAdmin/DeleteTeam");
var GetDashboardRouter = require("./routes/GetDashboard");
var GetProjectsCompletedRouter = require("./routes/GetProjectsCompleted");
var GetPMDashboardRouter = require("./routes/GetPMDashboard");
var TicketCompletionResponseRouter = require("./routes/ProjectManager/TicketCompletionResponse");
var GetEmployeeAttendanceRouter = require("./routes/GetEmployeeAttendance");
var GetEmployeeRequestsRouter = require("./routes/GetEmployeeRequests");


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
app.use("/api/v1/superadmin/addEmployee", AdminAddEmployeeRouter);
app.use("/api/v1/login", LoginRouter);
app.use("/api/v1/superadmin/getEmployees", GetEmployeesRouter);
app.use("/api/v1/superadmin/getEmployee", GetEmployeesUsingIdRouter);
app.use("/api/v1/superadmin/updateEmployee", UpdateEmployeeRouter);
app.use("/api/v1/superadmin/deleteEmployee", DeleteEmployeeRouter);
app.use("/api/v1/superadmin/addteam", CreateTeamRouter);
app.use("/api/v1/superadmin/updateTeam", UpdateTeamRouter);
app.use("/api/v1/superadmin/getTeams", GetTeamsRouter);
app.use("/api/v1/superadmin/getTeam", GetTeamRouter);
app.use("/api/v1/superadmin/addAdmin", AddAdminRouter);
app.use("/api/v1/superadmin/getAdmins", GetAdminsRouter);
app.use("/api/v1/superadmin/updateAdmin", UpdateAdminRouter);
app.use("/api/v1/superadmin/getProjects", GetProjectsRouter);
app.use("/api/v1/superadmin/getProject", GetProjectRouter);
app.use("/api/v1/superadmin/deleteProject", DeleteProjectRouter);
app.use("/api/v1/superadmin/getRequests", GetRequestsRouter);
app.use("/api/v1/superadmin/deleteRequest", DeleteLeaveRequestRouter);
app.use("/api/v1/superadmin/updateRequest", UpdateLeaveRequestRouter);
app.use("/api/v1/superadmin/getAttendance", GetAttendanceRouter);
app.use("/api/v1/admin/addProject", CreateProjectRouter);
app.use("/api/v1/admin/updateProject", UpdateProjectRouter);
app.use("/api/v1/admin/deleteProject", DeleteAProjectRouter);
app.use("/api/v1/pm/assignEmployeeToProject", AssignProjectRouter);
app.use("/api/v1/pm/generateTicket", CreateTicketRouter);
app.use("/api/v1/pm/getTickets", GetTicketsRouter);
app.use("/api/v1/pm/getTicket", GetTicketRouter);
app.use("/api/v1/pm/addComment", CreateCommentRouter);
app.use("/api/v1/pm/getComments", GetCommentsRouter);
app.use("/api/v1/pm/completionRequestResponse", UpdateLeaveRequest1Router);
app.use("/api/v1/pm/ticketCompletionResponse", TicketCompletionResponseRouter);
app.use("/api/v1/employee/dashboard", GetStatsRouter);
app.use("/api/v1/employee/startTimer", StartTimerRouter);
app.use("/api/v1/employee/stopTimer", StopTimerRouter);
app.use("/api/v1/employee/getAssignedTickets", GetAssignedTicketsRouter);
app.use("/api/v1/employee/getAssignedTicket", GetAssignedTicketRouter);
app.use("/api/v1/employee/completionrequest", CompletionRequestRouter);
app.use("/api/v1/employee/updateProfile", UpdateProfileRouter);
app.use("/api/v1/employee/addRequest", CreateLeaveRequestRouter);
app.use("/api/v1/employee/getAttendance", GetEmployeeAttendanceRouter);
app.use("/api/v1/employee/getRequests", GetEmployeeRequestsRouter);
app.use("/api/v1/superadmin/deleteTeam", DeleteTeamRouter);
app.use("/api/v1/superadmin/getDashboard", GetDashboardRouter);
app.use("/api/v1/superadmin/getProjectsCompleted", GetProjectsCompletedRouter);
app.use("/api/v1/pm/dashboard", GetPMDashboardRouter);


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
