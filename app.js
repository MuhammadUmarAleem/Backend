var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./utils/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// ADMIN 
var adminLoginRouter = require('./routes/Admin/adminlogin');
var authentication = require('./routes/Admin/authentication');
var AddCourseRouter = require('./routes/Admin/AddCourse');
var logRouter = require('./routes/Admin/log');
var addInstructorRouter = require('./routes/Admin/addInstructor');
var GetInstructorRouter = require('./routes/Admin/GetInstructor');
var enrollmentReportRouter = require('./routes/Admin/enrollmentReport');
var daywiseEnrollmentReportRouter = require('./routes/Admin/daywiseEnrollmentReport');
var getCourseRouter = require('./routes/Admin/getCourse');
var deleteCourseRouter = require('./routes/Admin/deleteCourse');
var deleteInstructorRouter = require('./routes/Admin/deleteInstructor');
var updateInstructorRouter = require('./routes/Admin/updateInstructor');
var updateCourseRouter = require('./routes/Admin/updateCourse');
var registerRouter = require('./routes/Users/register');
var verifyRouter = require('./routes/Users/verify');
var loginRouter = require('./routes/Users/login');
var changeStatusRouter = require('./routes/Admin/changestatus');
var changeInventoryStatusRouter = require('./routes/Admin/changeCourseStatus');
var getUsersRouter = require('./routes/Admin/getUsers');
var deleteUserRouter = require('./routes/Admin/deleteUser');
var addUserRouter = require('./routes/Admin/addUser');
var updateUserRouter = require('./routes/Admin/updateUser');
var updateAdminRouter = require('./routes/Admin/updateAdmin');
var updateCredentialsRouter = require('./routes/Admin/updateCredentials');
var buyProductRouter = require('./routes/Users/buyProduct');
var buyRouter = require('./routes/Users/buy');
var getOrdersRouter = require('./routes/Users/getOrders');
var getAllOrdersRouter = require('./routes/Admin/getOrders');
var getDashboardRouter = require('./routes/Admin/getDashboard');
var supportRouter = require('./routes/Users/support');
var getSupportRouter = require('./routes/Users/getSupport');
var replyRouter = require('./routes/Users/reply');
var getProfileRouter = require('./routes/Users/getProfile');
var updateProfileRouter = require('./routes/Users/updateProfile');

var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authentication', authentication);
app.use('/log', logRouter);
app.use('/adminlogin', adminLoginRouter);
app.use('/addCourse', AddCourseRouter);
app.use('/addInstructor', addInstructorRouter);
app.use('/getInstructor', GetInstructorRouter);
app.use('/enrollmentReport', enrollmentReportRouter);
app.use('/daywiseEnrollmentReport', daywiseEnrollmentReportRouter);
app.use('/getCourse', getCourseRouter);
app.use('/deleteCourse', deleteCourseRouter);
app.use('/deleteInstructor', deleteInstructorRouter);
app.use('/updateInstructor', updateInstructorRouter);
app.use('/updateCourse', updateCourseRouter);
app.use('/changeStatus', changeStatusRouter);
app.use('/changeStatusCourses', changeInventoryStatusRouter);
app.use('/getusers', getUsersRouter);
app.use('/deleteuser', deleteUserRouter);
app.use('/addUser', addUserRouter);
app.use('/updateUser', updateUserRouter);
app.use('/updateAdmin', updateAdminRouter);
app.use('/updateCredentials', updateCredentialsRouter);
app.use('/getAllOrders', getAllOrdersRouter);
app.use('/getDashboard', getDashboardRouter);  

// Users
app.use('/register', registerRouter);
app.use('/verify', verifyRouter);
app.use('/login', loginRouter);  
app.use('/buyProduct', buyProductRouter);  
app.use('/buy', buyRouter);  
app.use('/getOrders', getOrdersRouter);  
app.use('/support', supportRouter);  
app.use('/getSupport', getSupportRouter);  
app.use('/reply', replyRouter);  
app.use('/getProfile', getProfileRouter);  
app.use('/updateProfile', updateProfileRouter);  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
