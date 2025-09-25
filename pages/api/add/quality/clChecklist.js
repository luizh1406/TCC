import pool from "../../database.js";
import multer from "multer";
import fs from "fs";

// Configura o multer para salvar arquivos temporariamente
const upload = multer({ dest: "uploads/" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function insertQueryWithUpload(request, response) {
  if (request.method === "POST") {
    upload.any()(request, response, async (err) => {
      if (err) {
        console.error("Erro ao processar o upload:", err);
        return response
          .status(500)
          .json({ success: false, error: "Falha ao processar o upload" });
      }

      try {
        const questions = [];
        const dataKeys = Object.keys(request.body);

        console.log("FILES RECEBIDOS:", request.files); // debug
        console.log("BODY RECEBIDO:", request.body); // debug

        for (const key of dataKeys) {
          if (key.endsWith("_info")) {
            try {
              const info = JSON.parse(request.body[key]);
              const code = info.codigo_pergunta;
              let value;

              if (info.preenchimento === "Foto") {
                const file = request.files.find((f) => f.fieldname === code);
                if (file) {
                  const imageBuffer = fs.readFileSync(file.path);
                  value = imageBuffer;
                  fs.unlinkSync(file.path);
                } else {
                  value = null;
                }
              } else {
                value = request.body[code] ?? null;
              }

              questions.push({
                ...info,
                value,
                ns: request.body.nsProduto,
                user_email: request.body.userEmail,
              });
            } catch (e) {
              console.error(`Erro ao parsear JSON para a chave ${key}:`, e);
            }
          }
        }

        if (questions.length === 0) {
          return response.status(400).json({
            success: false,
            error: "Nenhum dado válido para salvar.",
          });
        }

        // Separa por tipo de preenchimento
        const normalQuestions = questions.filter(
          (q) => q.preenchimento !== "Foto"
        );
        const imageQuestions = questions.filter(
          (q) => q.preenchimento === "Foto"
        );

        // Inserção de registros "normais"
        let insertedNormal = [];
        if (normalQuestions.length > 0) {
          const insertQuery = `
            INSERT INTO clChecklist
              (nome, ns, linha, familia, setor, sequencia, descricao,
               preenchimento, codigo_pergunta, value, user_email)
            VALUES
              ${normalQuestions
                .map(
                  (_, idx) =>
                    `($${idx * 11 + 1}, $${idx * 11 + 2}, $${idx * 11 + 3}, $${
                      idx * 11 + 4
                    }, $${idx * 11 + 5},
                      $${idx * 11 + 6}, $${idx * 11 + 7}, $${idx * 11 + 8}, $${
                      idx * 11 + 9
                    }, $${idx * 11 + 10}, $${idx * 11 + 11})`
                )
                .join(", ")}
            RETURNING *;
          `;

          const values = normalQuestions.flatMap((row) => [
            row.nome,
            row.ns,
            row.linha,
            row.familia,
            row.setor,
            row.sequencia,
            row.descricao,
            row.preenchimento,
            row.codigo_pergunta,
            row.value,
            row.user_email,
          ]);

          const result = await pool.query(insertQuery, values);
          insertedNormal = result.rows;
        }

        // Inserção de registros com foto
        let insertedImages = [];
        if (imageQuestions.length > 0) {
          const insertQueryIMG = `
            INSERT INTO clChecklistIMG
              (nome, ns, linha, familia, setor, sequencia, descricao,
               preenchimento, codigo_pergunta, value, user_email)
            VALUES
              ${imageQuestions
                .map(
                  (_, idx) =>
                    `($${idx * 11 + 1}, $${idx * 11 + 2}, $${idx * 11 + 3}, $${
                      idx * 11 + 4
                    }, $${idx * 11 + 5},
                      $${idx * 11 + 6}, $${idx * 11 + 7}, $${idx * 11 + 8}, $${
                      idx * 11 + 9
                    }, $${idx * 11 + 10}, $${idx * 11 + 11})`
                )
                .join(", ")}
            RETURNING *;
          `;

          const valuesIMG = imageQuestions.flatMap((row) => [
            row.nome,
            row.ns,
            row.linha,
            row.familia,
            row.setor,
            row.sequencia,
            row.descricao,
            row.preenchimento,
            row.codigo_pergunta,
            row.value, // buffer da imagem
            row.user_email,
          ]);

          const resultIMG = await pool.query(insertQueryIMG, valuesIMG);
          insertedImages = resultIMG.rows;
        }

        response.status(201).json({
          success: true,
          checklist: insertedNormal,
          imagens: insertedImages,
        });

        console.log("Dados inseridos:", {
          checklist: insertedNormal,
          imagens: insertedImages,
        });
      } catch (error) {
        console.error("Erro ao inserir os dados:", error);
        response
          .status(500)
          .json({ success: false, error: "Falha ao inserir os dados" });
      }
    });
  } else {
    response.status(405).json({
      success: false,
      error: "Método não permitido",
    });
  }
}
