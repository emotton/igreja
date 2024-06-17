const localStrategy = require("passport-local").Strategy;
const usuarioService = require("../services/usuarioService");
const crypto = require("crypto");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "login",
        passwordField: "senha",
      },
      (login, senha, done) => {
        usuarioService.selectUsuarioByLogin(login).then((usu) => {
          if (usu.length > 0) {
            usuario = {
              id: usu[0].id_usuario,
              nome: usu[0].nome,
              login: usu[0].login,
              senha: usu[0].senha,
            };
            if (senha == usuario.senha) {
              return done(null, usuario);
            } else {
              return done(null, false, {
                message: "Usuário/senha incorretos",
              });
            }
          } else {
            return done(null, false, {
              message: "Usuário/senha incorretos",
            });
          }
        });
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser((id, done) => {
    usuarioService.selectUsuarioById(id).then((usu) => {
      usuario = {
        id: usu[0].id_usuario,
        nome: usu[0].nome,
        login: usu[0].login,
        senha: usu[0].senha,
      };
      done(null, usuario);
    });
  });
};
