const Usuario = require("../models/Usuario.js"); 
const bcrypt = require("bcrypt"); 
const passport = require("passport"); 
var LocalStrategy = require("passport-local"); 

passport.use(
  new LocalStrategy(async function (username, password, cb) {

    var usuario = await Usuario.findOne({ where: { email: username } });
    
    if (!usuario) {
      return cb(null,false, { msg: "Usuario não existe!" }); 
    } else {
      if (!bcrypt.compareSync(password, usuario.senha)) {
        return cb(null, false, { msg: "Senha incorreta!" });
      } else {
        return cb(null, usuario, {msg: "oi"}); 
      }
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email, nome: user.nome, admin: user.admin });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
module.exports = passport;