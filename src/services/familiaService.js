const { client } = require("./db");

async function selectFamilias() {
  const res = await client.query("SELECT * FROM familia");
  return res[0];
}

async function selectFamiliaById(id) {
  const res = await client.query("SELECT * FROM familia WHERE id_familia=?", [
    id,
  ]);
  return res[0];
}

async function insertFamilia(familia) {
  const sql = "INSERT INTO familia(nome) VALUES (?);";
  const values = [familia.nome];
  await client.query(sql, values);
}

async function updateFamilia(id, familia) {
  const sql = "UPDATE familia set nome=? WHERE id_familia = ?";
  const values = [familia.nome, id];
  await client.query(sql, values);
}

async function deleteFamilia(id) {
  const sql = "DELETE FROM familia WHERE id_familia = ?";
  const values = [id];
  await client.query(sql, values);
}

module.exports = {
  selectFamilias,
  selectFamiliaById,
  insertFamilia,
  updateFamilia,
  deleteFamilia,
};
