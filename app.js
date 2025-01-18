var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const crypto = require("crypto");
const passport = require('passport');
const session = require('express-session');
require("dotenv").config();
require('./utils/google');
require('./utils/twitter');
// require('./utils/facebook');
require("./utils/database");
const cors = require("cors");
require("dotenv").config();
require("./utils/database");
require("./utils/socket");
const axios = require("axios");
const cron = require("node-cron");
var app = express();

const { initWebSocket } = require('./utils/socket');


const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);


initWebSocket(server);

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});



app.get('/', (req, res) => {
    res.send('Hello! This is an HTTP server, not WebSocket.');
});



var indexRouter = require("./routes/index");
var usersRouter = require("./routes");

// Reg And Auth
var RegisterRouter = require("./routes/RegAndAuth/Register");
var VerifyEmailRouter = require("./routes/RegAndAuth/VerifyEmail");
var RegisterWithFacebookRouter = require("./routes/RegAndAuth/RegisterWithFacebook");
var RegisterWithGoogleRouter = require("./routes/RegAndAuth/RegisterWithGoogle");
var LoginRouter = require("./routes/RegAndAuth/Login");
var ForgotPasswordEmailRouter = require("./routes/RegAndAuth/ForgotPasswordEmail");
var PasswordResetSessionRouter = require("./routes/RegAndAuth/PasswordResetSession");
var RegisterSellerRouter = require("./routes/RegAndAuth/RegisterSeller");
var EditProfileRouter = require("./routes/RegAndAuth/EditProfile");
var GetProfileRouter=require("./routes/RegAndAuth/GetProfile");


//Product Listing
var AddProductRouter = require("./routes/ProductListing/AddProduct");
var UpdateProductRouter = require("./routes/ProductListing/UpdateProduct");
var AddCategoryRouter = require("./routes/ProductListing/AddCategory");
var GetProductsRouter = require("./routes/ProductListing/GetProducts");
var GetBuyerProductRouter = require("./routes/ProductListing/GetBuyerProduct");
var GetDiscountedProductsRouter = require("./routes/ProductListing/GetDiscountedProducts");
var GetBuyerProductsRouter = require("./routes/ProductListing/GetBuyerProducts");
var GetCategoriesRouter = require("./routes/ProductListing/GetCategories");
var BulkUploadRouter = require("./routes/ProductListing/BulkUpload");
var GetSellerDashboardRouter = require("./routes/ProductListing/GetSellerDashboard");
var GetSellerWalletRouter = require("./routes/ProductListing/GetSellerWallet");
var UpdateSellerCardRouter = require("./routes/ProductListing/UpdateSellerCard");
var WithdrawRouter = require("./routes/ProductListing/Withdraw");
var WishlistRouter = require("./routes/ProductListing/Wishlist");
var ToggleProductStatusRouter = require("./routes/ProductListing/ToggleProductStatus");
var DuplicateProductRouter = require("./routes/ProductListing/DuplicateProduct");
var BrandRouter = require("./routes/ProductListing/Brand");
var CategoryRouter = require("./routes/ProductListing/Category");
var AddProductImagesRouter = require("./routes/ProductListing/AddProductImages");
var UpdateAvailabilityRouter = require("./routes/ProductListing/UpdateAvailability");


//SearchAndFilter
var SearchProductsRouter = require("./routes/SearchAndFilter/SearchProducts");
var FilterProductsRouter = require("./routes/SearchAndFilter/FilterProducts");
var SearchAndFilterProductsRouter = require("./routes/SearchAndFilter/SearchAndFilterProducts");

// CartAndItem
var AddItemToCartRouter = require("./routes/CartAndOrder/AddItemToCart");
var GetCartRouter = require("./routes/CartAndOrder/GetCart");
var OrderRouter = require("./routes/CartAndOrder/Order");
var PaymentSuccess1Router = require("./routes/CartAndOrder/PaymentSuccess");
var DeleteItemFromCartRouter = require("./routes/CartAndOrder/DeleteItemFromCart");
var GetOrdersRouter = require("./routes/CartAndOrder/GetOrders");
var GetOrderDetailsRouter = require("./routes/CartAndOrder/GetOrderDetails");
var GetPaymentsRouter = require("./routes/CartAndOrder/GetPayments");
var RefundProductInOrderRouter = require("./routes/CartAndOrder/RefundProductInOrder");
var GetSellerProfileRouter = require("./routes/CartAndOrder/GetSellerProfile");
var GetBuyerOrdersRouter = require("./routes/CartAndOrder/GetBuyerOrders");

//Notifications
var GetNotificationsRouter = require("./routes/Notifications/GetNotifications");
var MarkAsReadRouter = require("./routes/Notifications/MarkAsRead");
var MarkAllAsReadRouter = require("./routes/Notifications/MarkAllAsRead");

// Inventory
var AddInventoryRouter = require("./routes/Inventory/AddInventory");
var UpdateStockRouter = require("./routes/Inventory/UpdateStock");
var SetOutOfStockRouter = require("./routes/Inventory/SetOutOfStock");
var GetInventoryRouter = require("./routes/Inventory/GetInventory");
var GetLowStockInventoryRouter = require("./routes/Inventory/GetLowStockInventory");

//Feedback
var AddFeedbackRouter = require("./routes/Feedback/AddFeedback");
var GetSellerFeedbackRouter = require("./routes/Feedback/GetSellerFeedback");
var GetProductFeedbackRouter = require("./routes/Feedback/GetProductFeedback");
var GetSellerFilteredFeedbackRouter = require("./routes/Feedback/GetSellerFilteredFeedback");
var GetBuyerFeedbacksRouter = require("./routes/Feedback/GetBuyerFeedbacks");

// Conversation
var StartConversationRouter = require("./routes/Conversation/StartConversation");
var SendMessageRouter = require("./routes/Conversation/SendMessage");
var MarkAsReadsRouter = require("./routes/Conversation/MarkAsRead");
var GetMessagesRouter = require("./routes/Conversation/GetMessages");
var GetConversationsRouter = require("./routes/Conversation/GetConversations");
var PinConversationRouter = require("./routes/Conversation/PinConversation");
var MuteConversationRouter = require("./routes/Conversation/MuteConversation");
var SearchConversationsRouter = require("./routes/Conversation/SearchConversations");
var SearchMessagesRouter = require("./routes/Conversation/SearchMessages");

// GeneralCustomers
var GetCustomersRouter = require("./routes/GeneralCustomers/GetCustomers");
var GetCustomersDetailsRouter = require("./routes/GeneralCustomers/GetCustomersDetails");

//Admin
var CreateUserRouter = require("./routes/Admin/CreateUser");
var GetUsersRouter = require("./routes/Admin/GetUsers");
var UpdateUserRouter = require("./routes/Admin/UpdateUser");
var DeleteUserRouter = require("./routes/Admin/DeleteUser");
var GetOrganizationsRouter = require("./routes/Admin/GetOrganizations");
var PlansRouter = require("./routes/Admin/Plans");
var PermissionTypesRouter = require("./routes/Admin/PermissionTypes");
var ProgramPermissionsRouter = require("./routes/Admin/ProgramPermissions");
var PlanAssignmentRouter = require("./routes/Admin/PlanAssignment");
var GetAdminDashboardRouter = require("./routes/Admin/GetDashboard");
var GetAllUsersRouter = require("./routes/Admin/GetAllUsers");

//Buyer
var EditBuyerRouter = require("./routes/Buyer/EditBuyer");
var GetBuyerRouter = require("./routes/Buyer/GetBuyer");
var GetBuyerDetails1Router = require("./routes/Buyer/GetBuyerDetails");


// Subscriptions
var GetSubscriptionRouter=require('./routes/SubscriptionPlan/GetSubscriptionPlans')
var CreateSubscriptionRouter=require('./routes/SubscriptionPlan/AddSubscriptionPlan')
var UpdateSubscriptionRouter=require('./routes/SubscriptionPlan/UpdateSubscriptionPlan')
var DeleteSubscriptionRouter=require('./routes/SubscriptionPlan/DeleteSubscriptionPlan')

var AddUserSubscriptionRouter=require("./routes/UserSubscription/AddUserSubscription")
var PaymentSuccessRouter=require("./routes/UserSubscription/AddUserSubscription")
//Buyer
var EditBuyerRouter=require("./routes/Buyer/EditBuyer")

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(session({
  secret: 'akshdkashdquooaksXCVBNLWIQ0EQWEK;LMlmkjwnsdjasnd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

function validateAPIKey(req, res, next) {
  const authkey = req.header('api-key');
  if (authkey && crypto.createHash('sha256').update(authkey).digest('hex') == process.env.API_KEY) {
    next();
  } else {
    res.status(401).send(`
      <html>
        <head>
          <title>Unauthorized Access</title>
          <style>
            body {
              background-color: #f8f8f8;
              font-family: Arial, sans-serif;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .container h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .container p {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .container a {
              text-decoration: none;
              color: #007bff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to access this resource.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
            <p><a href="/">Return to Home</a></p>
          </div>
        </body>
      </html>
    `);
  }
}

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

// Reg and Auth
app.use("/api/v1/register", RegisterRouter);
app.use("/api/v1/verifyEmail", VerifyEmailRouter);
app.use("/api/v1/registerWithFacebook", RegisterWithFacebookRouter);
app.use("/api/v1/registerWithGoogle", RegisterWithGoogleRouter);
app.use("/api/v1/login", LoginRouter);
app.use("/api/v1/forgotPasswordEmail", ForgotPasswordEmailRouter);
app.use("/api/v1/passwordResetSession", PasswordResetSessionRouter);
app.use("/api/v1/register/seller", RegisterSellerRouter);
app.use("/api/v1/editprofile", EditProfileRouter);
app.use("/api/v1/getprofile", GetProfileRouter);






// Subscriptions
app.use("/api/v1/getsubscriptions", GetSubscriptionRouter);
app.use("/api/v1/deletesubscription", DeleteSubscriptionRouter);
app.use("/api/v1/updatesubscription", UpdateSubscriptionRouter);
app.use("/api/v1/createsubscription", CreateSubscriptionRouter);
app.use("/api/v1/addusersubscription", AddUserSubscriptionRouter);
app.use("/api/v1/payment-success", AddUserSubscriptionRouter);




// Product Listing
app.use("/api/v1/seller/addProduct", AddProductRouter);
app.use("/api/v1/seller/updateProduct", UpdateProductRouter);
app.use("/api/v1/seller/addCategory", AddCategoryRouter);
app.use("/api/v1/seller", GetProductsRouter);
app.use("/api/v1/buyer", GetBuyerProductRouter);
app.use("/api/v1/category/get", GetCategoriesRouter);
app.use("/api/v1/product/getProducts", GetBuyerProductsRouter);
app.use("/api/v1/product/getDiscountedProducts", GetDiscountedProductsRouter);
app.use("/api/v1/seller/bulkUpload", BulkUploadRouter);
app.use("/api/v1/seller/getDashboard", GetSellerDashboardRouter);
app.use("/api/v1/seller/getWallet", GetSellerWalletRouter);
app.use("/api/v1/seller/updateCard", UpdateSellerCardRouter);
app.use("/api/v1/seller/withdraw", WithdrawRouter);
app.use("/api/v1/seller/wishlist", WishlistRouter);
app.use("/api/v1/product/toogleStatus", ToggleProductStatusRouter);
app.use("/api/v1/product/duplicate", DuplicateProductRouter);
app.use("/api/v1/product/category", CategoryRouter);
app.use("/api/v1/product/brand", BrandRouter);
app.use("/api/v1/product/addimages", AddProductImagesRouter);
app.use("/api/v1/product/updateAvailability", UpdateAvailabilityRouter);

// SearchAndFilter
app.use("/api/v1/products/search", SearchProductsRouter);
app.use("/api/v1/products/filter", FilterProductsRouter);
app.use("/api/v1/products/searchAndFilter", SearchAndFilterProductsRouter);

// CartAndOrder
app.use("/api/v1/cart/addItem", AddItemToCartRouter);
app.use("/api/v1/cart/details", GetCartRouter);
app.use("/api/v1/order/create", OrderRouter);
app.use("/api/v1/payment/success", PaymentSuccess1Router);
app.use("/api/v1/payment/deleteItem", DeleteItemFromCartRouter);
app.use("/api/v1/order/get", GetOrdersRouter);
app.use("/api/v1/order/getDetails", GetOrderDetailsRouter);
app.use("/api/v1/payment/get", GetPaymentsRouter);
app.use("/api/v1/payment/refund", RefundProductInOrderRouter);
app.use("/api/v1/seller/getProfile", GetSellerProfileRouter);
app.use("/api/v1/buyer/getOrders", GetBuyerOrdersRouter);

// Notifications
app.use("/api/v1/notification/getnotifications", GetNotificationsRouter);
app.use("/api/v1/notification/markAsRead", MarkAsReadRouter);
app.use("/api/v1/notification/markAllAsRead", MarkAllAsReadRouter);

// Inventory
app.use("/api/v1/inventory/add", AddInventoryRouter);
app.use("/api/v1/inventory/update", UpdateStockRouter);
app.use("/api/v1/inventory/setOutOfStock", SetOutOfStockRouter);
app.use("/api/v1/inventory/get", GetInventoryRouter);
app.use("/api/v1/inventory/getLowStock", GetLowStockInventoryRouter);

// Feedback
app.use("/api/v1/feedback/add", AddFeedbackRouter);
app.use("/api/v1/feedback/getSellerFeedback", GetSellerFeedbackRouter);
app.use("/api/v1/feedback/getProductFeedback", GetProductFeedbackRouter);
app.use("/api/v1/feedback/getSellerFilteredFeedback", GetSellerFilteredFeedbackRouter);
app.use("/api/v1/feedback/getBuyerFeedbacks", GetBuyerFeedbacksRouter);

// Conversation
app.use("/api/v1/conversation/start", StartConversationRouter);
app.use("/api/v1/message/send", SendMessageRouter);
app.use("/api/v1/message/read", MarkAsReadsRouter);
app.use("/api/v1/message", GetMessagesRouter);
app.use("/api/v1/conversation", GetConversationsRouter);
app.use("/api/v1/conversation/pin", PinConversationRouter);
app.use("/api/v1/conversation/mute", MuteConversationRouter);
app.use("/api/v1/conversation/search", SearchConversationsRouter);
app.use("/api/v1/message/search", SearchMessagesRouter);

// GeneralCustomers
app.use("/api/v1/generalCustomers/getCustomers", GetCustomersRouter);
app.use("/api/v1/generalCustomers/getCustomersDetails", GetCustomersDetailsRouter);

//Admin
app.use("/api/v1/admin/createUser", CreateUserRouter);
app.use("/api/v1/admin/getUsers", GetUsersRouter);
app.use("/api/v1/admin/updateUser", UpdateUserRouter);
app.use("/api/v1/admin/deleteUser", DeleteUserRouter);
app.use("/api/v1/admin/getOrganizaions", GetOrganizationsRouter);
app.use("/api/v1/admin/plans", PlansRouter);
app.use("/api/v1/admin/permissionTypes", PermissionTypesRouter);
app.use("/api/v1/admin/programPermissions", ProgramPermissionsRouter);
app.use("/api/v1/admin/planAssignment", PlanAssignmentRouter);
app.use("/api/v1/admin/getDashboard", GetAdminDashboardRouter);
app.use("/api/v1/admin/getAllUsers", GetAllUsersRouter);

//Buyer
app.use("/api/v1/buyer/edit", EditBuyerRouter);
app.use("/api/v1/buyer/get", GetBuyerRouter);
app.use("/api/v1/buyer/getDetail", GetBuyerDetails1Router);



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
