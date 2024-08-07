require("dotenv").config();
// Carregando modulos
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const favicon = require("serve-favicon");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const flash = require("connect-flash");

// rotas de navegação
const login = require("./routes/navegacao/login");
const home = require("./routes/navegacao/home");
const usuario = require("./routes/navegacao/usuario");
const setor = require("./routes/navegacao/setor");
const familia = require("./routes/navegacao/familia");
const pessoa = require("./routes/navegacao/pessoa");
const dizimo = require("./routes/navegacao/dizimo");

// rotas de API
const loginApi = require("./routes/api/login");
const usuarioApi = require("./routes/api/usuario");
const setorApi = require("./routes/api/setor");
const familiaApi = require("./routes/api/familia");
const pessoaApi = require("./routes/api/pessoa");
const dizimoApi = require("./routes/api/dizimo");

const app = express();

const optionsJS = {
  definition: {
    swagger: "2.0",
    info: {
      title: "Igreja - Library API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/api/*.js"],
};

const swaggerDocs = swaggerJsDoc(optionsJS);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const passport = require("passport");
require("./config/auth")(passport);

// Session
app.use(
  session({
    cookie: {
      maxAge: (86400000 / 24 / 60) * 15,
    },
    store: new MemoryStore({
      checkPeriod: (86400000 / 24 / 60) * 15,
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Configurações
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

var hbs = handlebars.create({
  helpers: {
    xif: require("./helpers/hbs_xif"),
    breaklines: require("./helpers/breaklines"),
  },
  defaultLayout: "main",
  partialsDir: ["views/partials/"],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "views");

// public
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  favicon(path.join(__dirname, "../public", "images", "icon-digicon.GIF"))
);

// Rotas

app.get("/", (req, res) => {
  res.redirect("/dashboard/login");
});

app.get("/dashboard", (req, res) => {
  res.redirect("/dashboard/login");
});

app.use("/dashboard/login", login);
app.use("/dashboard/home", home);
app.use("/dashboard/usuario", usuario);
app.use("/dashboard/setor", setor);
app.use("/dashboard/familia", familia);
app.use("/dashboard/pessoa", pessoa);
app.use("/dashboard/dizimo", dizimo);

// API
app.use("/dashboard/api/login", loginApi);
app.use("/dashboard/api/usuario", usuarioApi);
app.use("/dashboard/api/setor", setorApi);
app.use("/dashboard/api/familia", familiaApi);
app.use("/dashboard/api/pessoa", pessoaApi);
app.use("/dashboard/api/dizimo", dizimoApi);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
