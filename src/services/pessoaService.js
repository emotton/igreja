const { client } = require("./db");

async function selectPessoas() {
  const res = await client.query("SELECT * FROM pessoa order by nome");
  return res[0];
}

async function selectPessoasByIdFamilia(idFamilia) {
  const res = await client.query(
    "SELECT * FROM pessoa WHERE id_familia = ? order by nome",
    [idFamilia]
  );
  return res[0];
}

async function selectPessoaById(id) {
  const res = await client.query("SELECT * FROM pessoa WHERE id_pessoa=?", [
    id,
  ]);
  return res[0];
}

async function insertPessoa(pessoa) {
  const sql = "INSERT INTO pessoa(id_familia, nome) VALUES (?,?);";
  const values = [pessoa.id_familia, pessoa.nome];
  await client.query(sql, values);
}

async function updatePessoa(pessoa) {
  const sql = "UPDATE pessoa set nome=? WHERE id_pessoa = ?";
  const values = [pessoa.nome, pessoa.id_pessoa];
  await client.query(sql, values);
}

async function deletePessoa(id) {
  const sql = "DELETE FROM pessoa WHERE id_pessoa = ?";
  const values = [id];
  await client.query(sql, values);
}

module.exports = {
  selectPessoas,
  selectPessoaById,
  selectPessoasByIdFamilia,
  insertPessoa,
  updatePessoa,
  deletePessoa,
};
