const { client } = require("./db");

async function selectDizimoPagamentoByMes(mes) {
  const res = await client.query(
    `select f.id_familia, f.nome, ` +
      `case when dp.id_familia is not null then 'pago' else '' end status ` +
      `from familia f ` +
      `left join dizimo_pagamento dp on f.id_familia = dp.id_familia ` +
      `and mes = ? ` +
      `order by f.nome`,
    [mes]
  );
  return res[0];
}

async function selectIdsDizimoPagamentoByMes(mes) {
  const res = await client.query(
    `select f.id_familia ` +
      `from familia f ` +
      `inner join dizimo_pagamento dp on f.id_familia = dp.id_familia ` +
      `and mes = ? ` +
      `order by f.id_familia`,
    [mes]
  );
  return res[0];
}

async function insertDizimoPagamento(mes, id) {
  const sql = `INSERT INTO dizimo_pagamento (mes, id_familia) VALUES (?, ?)`;
  const values = [mes, id];
  await client.query(sql, values);
}

async function deleteDizimoPagamento(mes, id) {
  const sql = `DELETE FROM dizimo_pagamento where mes = ? and id_familia = ?`;
  const values = [mes, id];
  await client.query(sql, values);
}

async function selectDizimoByMes(mes) {
  const res = await client.query(
    `select * ` + `from dizimo ` + `where mes = ? `,
    [mes]
  );
  return res[0];
}

async function insertDizimo(mes, valor) {
  const sql = `INSERT INTO dizimo (mes, valor) VALUES (?, ?)`;
  const values = [mes, valor];
  await client.query(sql, values);
}

async function updateDizimo(mes, valor) {
  const sql = `UPDATE dizimo ` + `set valor=? ` + `WHERE mes = ?`;
  const values = [valor, mes];
  await client.query(sql, values);
}

module.exports = {
  selectDizimoPagamentoByMes,
  selectIdsDizimoPagamentoByMes,
  insertDizimoPagamento,
  deleteDizimoPagamento,
  selectDizimoByMes,
  insertDizimo,
  updateDizimo,
};
