const { client } = require("./db");

async function selectUsuarios() {
  const res = await client.query("SELECT * FROM usuario");
  return res[0];
}

module.exports = { selectUsuarios };
