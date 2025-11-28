import pool from "../database.js";

export default async function updateQuery(request, response) {
  // Nome da função mais claro
  if (request.method === "POST") {
    // A API espera que o corpo da requisição seja um array de um objeto, então pegamos data[0]
    // Se você corrigiu o front-end, 'data' deve ser o objeto único {nr_op: 22, ...}
    const data = request.body;

    // Validação básica para garantir que 'data' é um objeto (se tiver feito a correção do estado no front)
    if (Array.isArray(data) || !data || !data.id) {
      return response
        .status(400)
        .json({
          success: false,
          error: "Dados de atualização ausentes ou em formato incorreto.",
        });
    }

    // ⭐️ AJUSTE DE SEGURANÇA: Usando query parametrizada
    const sqlQuery = `
      UPDATE headRNC SET
        nr_op = $1,
        ns = $2,
        setor = $3,
        data_ocorrencia = $4,
        codigo_projeto = $5,
        email = $6,
        descricao = $7
      WHERE id = $8
    `;

    // Lista de valores a serem substituídos pelos placeholders ($1, $2, etc.)
    const values = [
      data.nr_op,
      data.ns,
      data.setor,
      data.data_ocorrencia,
      data.codigo_projeto,
      data.email,
      data.descricao,
      data.id, // O ID usado na cláusula WHERE
    ];

    console.log(`Executing UPDATE for ID: ${data.id}`);

    try {
      const result = await pool.query(sqlQuery, values);

      // ⭐️ AJUSTE DE VERIFICAÇÃO E RESPOSTA:
      const rowsAffected = result.rowCount;

      if (rowsAffected > 0) {
        // Status 200 OK para atualização bem-sucedida com conteúdo no corpo
        response
          .status(200)
          .json({
            success: true,
            message: `RNC ID ${data.id} atualizada com sucesso.`,
            rowsAffected: rowsAffected,
          });
        console.log(
          `RNC ID ${data.id} updated: ${rowsAffected} row(s) affected.`
        );
      } else {
        // Se 0 linhas foram afetadas, o registro com esse ID não existe
        response
          .status(404)
          .json({
            success: false,
            error: `Nenhum RNC encontrado com ID ${data.id} para atualização.`,
          });
        console.log(`No RNC found with ID ${data.id} for update.`);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      response
        .status(500)
        .json({ success: false, error: "Failed to update data" });
    }
  } else {
    response.status(405).json({ success: false, error: "Method not allowed" });
  }
}
