const { client } = require("./db");

async function selectFamilias() {
  const res = await client.query(`SELECT * FROM familia order by nome`);
  return res[0];
}

async function selectFamiliaById(id) {
  const res = await client.query(`SELECT * FROM familia WHERE id_familia=?`, [
    id,
  ]);
  return res[0];
}

async function insertFamilia(familia) {
  const sql =
    `INSERT INTO familia(nome, endereco, numero, id_setor) ` +
    `VALUES (?,?,?,?);`;
  const values = [
    familia.nome,
    familia.endereco,
    familia.numero,
    familia.id_setor,
  ];
  await client.query(sql, values);
}

async function updateFamilia(familia) {
  const sql =
    `UPDATE familia ` +
    `set nome=?, endereco=?, numero=?, id_setor=? ` +
    `WHERE id_familia = ?`;
  const values = [
    familia.nome,
    familia.endereco,
    familia.numero,
    familia.id_setor,
    familia.id_familia,
  ];
  await client.query(sql, values);
}

async function deleteFamilia(id) {
  const sql = `DELETE FROM familia ` + `WHERE id_familia = ?`;
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
