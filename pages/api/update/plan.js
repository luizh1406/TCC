import pool from "../database.js";

export default async function updateQuery(request, response) {
  if (request.method === "POST") {
    // Presume-se que 'data' é um array contendo um único objeto de plano de ação (data[0])
    const planoData = request.body[0];

    console.table(planoData);

    // ⭐️ AJUSTE DE SEGURANÇA E LÓGICA: Usando query parametrizada para UPDATE
    const sqlQuery = `
      UPDATE planosRNC 
      SET 
        codigo = $2, 
        descricao = $3, 
        ativo = $4, 
        solucao = $5
      WHERE 
        id = $1
    `;

    const values = [
      planoData.id, // $1: ID da RNC (para a cláusula WHERE)
      planoData.codigo, // $2: Código
      planoData.descricao, // $3: Descrição
      planoData.ativo, // $4: Ativo
      planoData.solucao, // $5: Solução
    ];

    console.log("SQL Query (Parametrizada):", sqlQuery);
    console.log("Values:", values);

    try {
      const result = await pool.query(sqlQuery, values);

      const rowsAffected = result.rowCount;

      // ⭐️ AJUSTE DE RESPOSTA: Status 200 OK para sucesso no UPDATE
      if (rowsAffected > 0) {
        response.status(200).json({
          success: true,
          message: `Plano de ação ID ${planoData.id} atualizado com sucesso.`,
          rowsAffected: rowsAffected,
        });
        console.log(`Data updated: ${rowsAffected} row(s) affected.`);
      } else {
        // Se 0 linhas foram afetadas, o registro não foi encontrado
        response.status(404).json({
          success: false,
          error:
            "Nenhum plano de ação encontrado com o ID fornecido para atualização.",
        });
        console.log("Aviso: Nenhuma linha atualizada.");
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
