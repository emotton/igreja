const { client } = require("./db");

async function selectDizimoByMes(mes) {
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

async function selectIdsDizimoByMes(mes) {
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

async function insertDizimo(mes, id) {
  const sql = `INSERT INTO dizimo_pagamento (mes, id_familia) VALUES (?, ?)`;
  const values = [mes, id];
  await client.query(sql, values);
}

async function deleteDizimo(mes, id) {
  const sql = `DELETE FROM dizimo_pagamento where mes = ? and id_familia = ?`;
  const values = [mes, id];
  await client.query(sql, values);
}

module.exports = {
  selectDizimoByMes,
  selectIdsDizimoByMes,
  insertDizimo,
  deleteDizimo,
};
