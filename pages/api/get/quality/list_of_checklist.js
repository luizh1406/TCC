import pool from "../../database.js";

export default async function searchQuery(request, response) {
  const select = "select DISTINCT nome, linha, familia, setor from checklists";

  const result = await pool.query(select);
  const resultRows = result.rows;
  const resultProps = { props: { resultRows } };
  response.json(resultProps);
}
