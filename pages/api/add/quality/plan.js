import pool from "../../database.js";

export default async function insertQuery(request, response) {
  if (request.method === "POST") {
    const data = request.body;

    console.table(data);

    let select = [
      "INSERT INTO planosRNC (id, codigo, descricao, ativo, solucao ) values (",
      data[0].id,
      ",",
      data[0].codigo,
      ", '",
      data[0].descricao,
      "', '",
      data[0].ativo,
      "', '",
      data[0].solucao,
      "')",
    ].join("");

    console.log(select);

    try {
      const result = await pool.query(select);
      response.status(201).json({ success: true, data: result.rows[0] });
      console.log("Data inserted:", result.rows[0]);
    } catch (error) {
      console.error("Error inserting data:", error);
      response
        .status(500)
        .json({ success: false, error: "Failed to insert data" });
    }
  } else {
    response.status(405).json({ success: false, error: "Method not allowed" });
  }
}
