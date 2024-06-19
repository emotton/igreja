const { client } = require("./db");

async function selectSetores() {
  const res = await client.query("SELECT * FROM setor order by nome");
  return res[0];
}

async function selectSetorById(id) {
  const res = await client.query("SELECT * FROM setor WHERE id_setor=?", [id]);
  return res[0];
}

async function insertSetor(setor) {
  const sql = "INSERT INTO setor(nome) VALUES (?);";
  const values = [setor.nome];
  await client.query(sql, values);
}

async function updateSetor(setor) {
  const sql = "UPDATE setor set nome=? WHERE id_setor = ?";
  const values = [setor.nome, setor.id_setor];
  await client.query(sql, values);
}

async function deleteSetor(id) {
  const sql = "DELETE FROM setor WHERE id_setor = ?";
  const values = [id];
  await client.query(sql, values);
}

module.exports = {
  selectSetores,
  selectSetorById,
  insertSetor,
  updateSetor,
  deleteSetor,
};
