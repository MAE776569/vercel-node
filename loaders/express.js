const createError = require("http-errors")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("passport")
const userModel = require("../models/user.model")
const routes = require("../routes")
const path = require("path")
const logger = require("morgan")

function loadExpressApp(app) {
  app.use(logger("dev"))
  app.use(
    cors({
      credentials: true,
      origin: [process.env.STORE_URL, process.env.DASHBOARD_URL],
    }),
  )
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  )

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(cookieParser(process.env.SECRET))
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
      cookie: {
        secure: JSON.parse(process.env.SECURE_COOKIE),
        httpOnly: JSON.parse(process.env.HTTP_ONLY_COOKIE),
        signed: true,
        maxAge: Number(process.env.COOKIE_MAX_AGE),
      },
    }),
  )

  app.use("/media", express.static(path.join(__dirname, "../media")))
  app.use("/public", express.static(path.join(__dirname, "../public")))

  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(userModel.createStrategy())
  passport.serializeUser(userModel.serializeUser())
  passport.deserializeUser((username, callback) => {
    userModel.findByUsername(username).populate("role").exec(callback)
  })

  app.use(routes)

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError.NotFound())
  })

  // error handler
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Error",
      data: null,
    })
  })
}

module.exports = loadExpressApp
