const { client } = require("./db");

async function selectUsuarios() {
  const res = await client.query("SELECT * FROM usuario");
  return res[0];
}

async function selectUsuarioById(id) {
  const res = await client.query("SELECT * FROM usuario WHERE id_usuario=?", [
    id,
  ]);
  return res[0];
}

async function selectUsuarioByLogin(login) {
  const res = await client.query("SELECT * FROM usuario WHERE login=?", [
    login,
  ]);
  return res[0];
}

module.exports = { selectUsuarios, selectUsuarioById, selectUsuarioByLogin };
