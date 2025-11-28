import pool from "../../database.js";

// Helper to escape single quotes for SQL
const escapeSQL = (str) => (str ? str.toString().replace(/'/g, "''") : "");

export default async function insertQuery(request, response) {
  if (request.method !== "POST") {
    return response
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    let questions = request.body;

    if (typeof questions === "string") {
      questions = JSON.parse(questions);
    }

    if (questions && questions.questions) {
      questions = questions.questions;
    }

    if (!Array.isArray(questions)) {
      return response
        .status(400)
        .json({ success: false, error: "`questions` deve ser um array" });
    }

    const valuesArr = questions.map((row) => {
      return `('${escapeSQL(row.nome)}','${escapeSQL(
        row.linha
      )}','${escapeSQL(row.familia)}','${escapeSQL(row.setor)}','${escapeSQL(
        row.sequencia
      )}','${escapeSQL(row.descricao)}','${escapeSQL(
        row.preenchimento
      )}','${escapeSQL(row.codigo_pergunta)}')`;
    });

    const query = `
      INSERT INTO checklists
      (nome, linha, familia, setor, sequencia, descricao, preenchimento, codigo_pergunta)
      VALUES ${valuesArr.join(",")}
      RETURNING *;
    `;

    const result = await pool.query(query);

    return response.status(201).json({
      success: true,
      cfData: result.rows?.[0] ?? null,
    });

  } catch (error) {
    console.error("Error inserting data:", error);
    return response
      .status(500)
      .json({ success: false, error: "Failed to insert data" });
  }
}
