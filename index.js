const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('Set SESSION_SECRET to at least 32 characters');
}
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

const conn = require("./db/conn");

// models
const Tought = require('./models/Tought')
const User = require('./models/User')

// Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require("./routes/authRoutes")

// import Controller
const ToughtController = require("./controllers/ToughtController");

// template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);

// receber resposta do body (form HTML)
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// session midleware
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 360000,
      httpOnly: true
    }
  })
);

// flash messages
app.use(flash())

//public path
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {

  if(req.session.userid){
    res.locals.session = req.session
  }

  next()

})

// Routes
app.use('/toughts', toughtsRoutes)
app.use("/", authRoutes)
app.get('/', ToughtController.showToughts)

conn
  //.sync({force: true})
  .sync()
  .then(() => {
    app.listen(Number(process.env.PORT || 3001), process.env.HOST || "127.0.0.1");
  })
  .catch(() => {
    console.error("Database startup failed. Check the DB_* configuration.");
    process.exitCode = 1;
  });
