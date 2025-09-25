import pool from "../../database.js";

// Helper to escape single quotes for SQL
const escapeSQL = str => str ? str.replace(/'/g, "''") : "";

export default async function insertQuery(request, response) {
  if (request.method === "POST") {
    const questions = request.body;

    // Build values array with proper escaping
    const valuesArr = questions.map(row =>
      `('${escapeSQL(row.nome)}','${escapeSQL(row.linha)}','${escapeSQL(row.familia)}','${escapeSQL(row.setor)}','${escapeSQL(row.sequencia)}','${escapeSQL(row.descricao)}','${escapeSQL(row.preenchimento)}','${escapeSQL(row.codigo_pergunta)}')`
    );

    const select = `INSERT INTO checklists (nome, linha, familia, setor, sequencia, descricao, preenchimento, codigo_pergunta) VALUES ${valuesArr.join(",")}`;

    console.log(select);
    try {
      const result = await pool.query(select);
      response.status(201).json({ success: true, cfData: result.rows[0] });
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