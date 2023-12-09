import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import session from "express-session";
import mongoSanitize from "express-mongo-sanitize";
import MongoStore from "connect-mongo";
import helmet from "helmet";

import products from "./routes/products.js";
import reviews from "./routes/reviews.js";
import search from "./routes/search.js";
import users from "./routes/users.js";
import AppError from "./utils/AppError.js";

import User from "./models/user.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(mongoSanitize());

const store = MongoStore.create({
  mongoUrl: process.env.CONNECTION,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

store.on("error", function (e) {
  console.log("session store error");
});

const sessionConfig = {
  store,
  name: "trust-alma",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    //sameSite: "none",
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));
app.use(cookieParser(process.env.SECRET));
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/users/oauth2/redirect/google",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({ googleId: profile.id });

        if (currentUser) {
          done(null, currentUser);
        } else {
          const newUser = await new User({
            email: profile.emails?.[0].value,
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile.photos?.[0].value,
          }).save();
          done(null, newUser);
        }
      } catch (e) {
        throw new AppError("Google Login Error: " + e.message, 401);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  User.findById(_id).then((user) => {
    done(null, user._id);
  });
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/products", products);
app.use("/products/:id/reviews", reviews);
app.use("/search", search);
app.use("/users", users);

app.get("/", (req, res) => {
  res.send("APP RUNNING!");
});

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).json({ status: status, message: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((e) =>
    console.log("Something went wrong and could not start server.")
  );
