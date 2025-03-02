require("dotenv").config();

const express = require("express");
const cors = require('cors');
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5454/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
    return res.status(200).send(" <a href='/auth/google'>Login with Google</a>");
});

const authRouter = require("./routes/auth.routes.js");
app.use("/auth", authRouter);

const userRouter = require("./routes/user.routes.js");
app.use("/api/users", userRouter);

const productRouter = require("./routes/product.routes.js");
app.use("/api/products", productRouter);

const adminProductRouter = require("./routes/product.admin.routes.js");
app.use("/api/admin/products", adminProductRouter);

const cartRouter = require("./routes/cart.routes.js");
app.use("/api/cart", cartRouter);

const cartItemRouter = require("./routes/cartItem.routes.js");
app.use("/api/cart_items", cartItemRouter);

const orderRouter = require("./routes/order.routes.js");
app.use("/api/orders", orderRouter);

const paymentRouter = require("./routes/payment.routes.js");
app.use('/api/payments', paymentRouter);

const reviewRouter = require("./routes/review.routes.js");
app.use("/api/reviews", reviewRouter);

const ratingRouter = require("./routes/rating.routes.js");
app.use("/api/ratings", ratingRouter);

// admin routes handler
const adminOrderRoutes = require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders", adminOrderRoutes);

// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });

module.exports = { app };