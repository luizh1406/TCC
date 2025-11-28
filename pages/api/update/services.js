import pool from "../database.js";

export default async function updateQuery(request, response) {
  if (request.method === "POST") {
    // Presume-se que 'data' é um array contendo um único objeto de serviço (data[0])
    const serviceData = request.body[0];

    console.table(serviceData);

    // ⭐️ AJUSTE DE SEGURANÇA E LÓGICA: Usando query parametrizada para UPDATE
    // Assumimos que a combinação de 'id' (ID da RNC) e 'codigo' (Código do Serviço)
    // identifica unicamente a linha a ser atualizada.
    const sqlQuery = `
      UPDATE services 
      SET 
        descricao = $3, 
        tempo = $4, 
        valorunitario = $5, 
        valorTotal = $6
      WHERE 
        id = $1 AND codigo = $2
    `;

    const values = [
      serviceData.id, // $1: ID da RNC (para a cláusula WHERE)
      serviceData.codigo, // $2: Código do Serviço (para a cláusula WHERE)
      serviceData.descricao, // $3: Descrição
      serviceData.tempo, // $4: Tempo
      serviceData.valorunitario, // $5: Valor Unitário
      serviceData.valortotal, // $6: Valor Total
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
          message: `Serviço atualizado com sucesso.`,
          rowsAffected: rowsAffected,
        });
        console.log(`Data updated: ${rowsAffected} row(s) affected.`);
      } else {
        // Se 0 linhas foram afetadas, o registro não foi encontrado
        response.status(404).json({
          success: false,
          error:
            "Nenhum serviço encontrado com os IDs fornecidos para atualização.",
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
