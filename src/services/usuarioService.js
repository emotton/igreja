const { client } = require("./db");

async function selectUsuarios() {
  const res = await client.query("SELECT * FROM usuario order by login");
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

async function insertUsuario(usuario) {
  const sql = "INSERT INTO usuario(nome,login,senha) VALUES (?,?,?);";
  const values = [usuario.nome, usuario.login, usuario.senha];
  await client.query(sql, values);
}

async function updateUsuario(usuario) {
  const sql = "UPDATE usuario set nome=?,login=?,senha=? WHERE id_usuario = ?";
  const values = [
    usuario.nome,
    usuario.login,
    usuario.senha,
    usuario.id_usuario,
  ];
  await client.query(sql, values);
}

async function deleteUsuario(id) {
  const sql = "DELETE FROM usuario WHERE id_usuario = ?";
  const values = [id];
  await client.query(sql, values);
}

module.exports = {
  selectUsuarios,
  selectUsuarioById,
  selectUsuarioByLogin,
  insertUsuario,
  updateUsuario,
  deleteUsuario,
};
