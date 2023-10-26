//todos modulos necessário sendo inicializados
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const port = 3000; //definindo a porta
//inizializar o express
const app = express();
//chamando a conexão com a base de dados
const conn = require("./db/conn");
//models
const Thought = require("./models/Thought");

//import das rotas
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const authRoutes = require("./routes/authRoutes");
//import controller
const ThoughtController = require("./controllers/ThoughtsController");

const flash = require("express-flash");

//definindo a engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//middle's para poder tratar os json's vindo do body
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//session middleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret", // Substitua por uma chave secreta segura
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

//flash-messages
app.use(flash());

app.use(express.static("public"));
//set session to res
app.use((req, res, next) => {
  console.log(req.session.userid);
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

//routes
app.use("/toughts", thoughtsRoutes);
app.use("/", authRoutes);
app.get("/", ThoughtController.showThoughts);

conn
  .sync()
  .then(() => app.listen(port))
  .catch((err) => console.log(err));
