const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3003;
var session = require("express-session");
var passport = require("passport"); 
var moment = require("moment"); 
app.locals.moment = moment;

const principalRoute = require("./router/principalRoute");

const Token = require("./models/Token");
const Usuario = require("./models/Usuario");
const Turma = require("./models/Turmas");
const Curso = require("./models/Curso");
const AvaliacaoDae = require("./models/Avaliacaodae");
const Avaliacao = require("./models/Avaliacao");


Token.belongsTo(Usuario);
Usuario.hasMany(Token);

Turma.belongsTo(Curso);
Curso.hasMany(Turma);

Usuario.belongsTo(Turma);
Turma.hasMany(Usuario);

AvaliacaoDae.belongsTo(Usuario);
Usuario.hasMany(AvaliacaoDae);

Avaliacao.belongsTo(Usuario);
Usuario.hasMany(Avaliacao);

//configuração dos arquivos de visão (VIEWS)
app.set("view engine", "ejs");

//configurar para receber dados por metodo post
app.use(express.urlencoded({ extended: false }));


//pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

app.use("/", principalRoute);


app.listen(port, function () {
  console.log("Servidor funcionando na porta: " + port);
});