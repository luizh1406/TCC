import pool from "../database.js";

export default async function updateQuery(request, response) {
  if (request.method === "POST") {
    // Presumimos que 'data' é um array de um objeto, como em 'data[0]'
    const materialData = request.body[0];

    console.table(materialData); // Agora exibe o objeto diretamente

    // Verifica se os campos necessários existem
    if (
      !materialData ||
      materialData.id === undefined ||
      materialData.codigo === undefined
    ) {
      return response
        .status(400)
        .json({ success: false, error: "Dados de material incompletos." });
    }

    // Usamos UPDATE para editar o registro.
    // Usamos WHERE id = $1 AND codigo = $2 para identificar o registro específico a ser atualizado.
    const sqlQuery = `
      UPDATE materialRNC 
      SET 
        descricao = $3, 
        quantidade = $4, 
        valorunitario = $5, 
        valorTotal = $6
      WHERE 
        id = $1 AND codigo = $2
    `;

    const values = [
      materialData.id,
      materialData.codigo,
      materialData.descricao,
      materialData.quantidade,
      materialData.valorunitario,
      materialData.valortotal,
    ];

    console.log("SQL Query:", sqlQuery);
    console.log("Values:", values);

    try {
      const result = await pool.query(sqlQuery, values);

      // Verifica se alguma linha foi realmente atualizada
      if (result.rowCount === 0) {
        // Se nenhuma linha foi atualizada, o registro pode não existir.
        // Neste caso, você pode decidir se deve Inserir (UPSERT) ou retornar um erro.
        // Para este ajuste, vamos apenas indicar que nada foi atualizado:
        console.log(
          "Aviso: Nenhuma linha atualizada. MaterialRNC não encontrado com ID e Código fornecidos."
        );
      }

      response
        .status(200)
        .json({ success: true, updatedRows: result.rowCount });
      console.log(`Data updated: ${result.rowCount} row(s)`);
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
