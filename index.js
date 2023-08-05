const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const passwordResetRoute = require("./routes/passwordReset");
const addressRoute = require("./routes/address");
const categoryRoute = require("./routes/category");
const contactRoute = require("./routes/contactUs");
const stripeRoute = require("./routes/stripe");
// const oAuthRoute = require("./routes/oauth");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Set EJS as the view engine
app.set("view engine", "ejs"); // Add this line

//without this, we can't use dotenv
dotenv.config();

//session initialization
app.use(
  session({
    secret: "ludwigdieter",
    resave: false,
    saveUninitialized: false
    // cookie: { secure: true }
  })
);

//Passport Config
require("./middleware/passport");

//connection to the database, its a promise
const connection = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB is Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware, without express.json, auth & user will be returned undefined
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/password-reset", passwordResetRoute);
app.use("/api/address", addressRoute);
app.use("/api/category", categoryRoute);
app.use("/api/contact", contactRoute);
app.use("/api/checkout", stripeRoute);
// app.use("/auth", oAuthRoute);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//cors policy
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//listen to the port
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend is Connected");
});
