import pool from "../../database.js";

export default async function searchQuery(request, response) {
  const select = `
    select 
      *
    from headrnc
    order by id desc`;

  const result = await pool.query(select);
  const resultRows = result.rows;
  const resultProps = { props: { resultRows } };
  response.json(resultProps);
}
