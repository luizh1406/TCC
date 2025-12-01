import pool from "../../database.js";

export default async function searchQuery(request, response) {
  const select = `
    select headrnc.id, headrnc.nr_op, headrnc.ns, headrnc.setor, headrnc.data_ocorrencia, headrnc.codigo_projeto, headrnc.image,
headrnc.email, headrnc.descricao, planosrnc.solucao from headrnc
left join planosrnc on headrnc.id = planosrnc.id`;

  const result = await pool.query(select);
  const resultRows = result.rows;
  const resultProps = { props: { resultRows } };
  response.json(resultProps);
}
 