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

module.exports = {
  selectDizimoByMes,
};
