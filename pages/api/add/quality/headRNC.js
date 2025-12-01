import pool from "../../database.js";

export default async function insertQuery(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const data = request.body[0];

    // 1. Converter base64 para bytes reais
    const buffer = data.image_base64
      ? Buffer.from(data.image_base64, "base64")
      : null;

    const query = `
      INSERT INTO headRNC 
      (id, nr_op, ns, setor, data_ocorrencia, codigo_projeto, image, email, descricao) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      data.id,
      data.op,
      data.ns,
      data.setor,
      data.data_ocorrido,
      data.projeto,
      buffer, // <-- AGORA SIM: imagem em bytes reais
      data.email,
      data.ocorrencia,
    ];

    const result = await pool.query(query, values);

    response.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao inserir:", error);
    response.status(500).json({
      success: false,
      error: "Failed to insert data",
    });
  }
}
 