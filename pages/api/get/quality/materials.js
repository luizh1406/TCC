import pool from "../../database.js";

export default async function searchQuery(request, response) {
  const { id } = request.query;

  const select = ["select * from materialRNC where id = '", id, "'"].join("");

  const result = await pool.query(select);
  const resultRows = result.rows;
  const resultProps = { props: { resultRows } };
  response.json(resultProps);
}
