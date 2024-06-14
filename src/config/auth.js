const localStrategy = require("passport-local").Strategy;
// const acesso = require("../services/acesso");
// const acessoByID = require("../services/acessoByID");
const crypto = require("crypto");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "senha",
      },
      (email, senha, done) => {
        /*
        acesso.get(email).then((usu) => {
          usu = usu[0];

          let hash = crypto.createHash("md5").update(senha).digest("hex");

          if (hash == usu.VC_SENHA) {
            usuario = {
              id: usu.NI_IDUSUARIO,
              email: usu.VC_USUARIO,
              senha: usu.VC_SENHA,
            };

            return done(null, usuario);
          } else {
            return done(null, false, {
              message: "Usuário/senha incorretos",
            });
          }
        });
        */
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser((id, done) => {
    acessoByID.get(id).then((usu) => {
      usuario = {
        id: usu[0].NI_IDUSUARIO,
        email: usu[0].VC_USUARIO,
        senha: usu[0].VC_SENHA,
      };
      done(null, usuario);
    });
  });
};
