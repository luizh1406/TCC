import pool from "../database.js";

export default async function searchQuery(request, response) {
  const data = request.body;
  const query = [
    "UPDATE tab996 SET posicao = '",
    data.posicao,
    "' WHERE id = '",
    data.id,
    "'",
  ].join("");
  const result = await pool.query(query);
  const resultRows = result.rows;
  const resultProps = { props: { resultRows } };
  response.json(resultProps);
}
