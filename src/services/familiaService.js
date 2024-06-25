const { client } = require("./db");

async function selectFamilias() {
  const res = await client.query(
    `SELECT f.id_familia, f.nome, count(p.id_pessoa) qtde FROM familia f ` +
      `left join pessoa p on p.id_familia = f.id_familia ` +
      `group by f.id_familia, f.nome ` +
      `order by f.nome`
  );
  return res[0];
}

async function selectFamiliaById(id) {
  const res = await client.query(`SELECT * FROM familia WHERE id_familia=?`, [
    id,
  ]);
  return res[0];
}

async function selectFamiliaByLikeNome(nome) {
  nome = `%${nome}%`;
  const res = await client.query(`SELECT * FROM familia WHERE nome like ?`, [
    nome,
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
  selectFamiliaByLikeNome,
  insertFamilia,
  updateFamilia,
  deleteFamilia,
};
