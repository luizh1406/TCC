import fs from "fs";
import path from "path";
import multer from "multer";
import pool from "../../database.js";

// Multer
const upload = multer({
  dest: path.join(
    process.env.NODE_ENV === "development" ? "uploads" : "/tmp"
  ),
});

// Next.js config
export const config = {
  api: {
    bodyParser: false,
  },
};

// ------------------------------------------------------
// EXPORTADO ✔
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
// ------------------------------------------------------

// ------------------------------------------------------
// EXPORTADO ✔
export function processQuestion(key, request) {
  if (!key.endsWith("_info")) return null;

  try {
    const info = JSON.parse(request.body[key]);
    const code = info.codigo_pergunta;
    let value = null;

    if (info.preenchimento === "Foto") {
      const file = request.files?.find((f) => f.fieldname === code);
      if (file) {
        const imageBuffer = fs.readFileSync(file.path);
        value = imageBuffer;
        fs.unlinkSync(file.path);
      }
    } else {
      value = request.body[code] ?? null;
    }

    return {
      ...info,
      value,
      ns: request.body.nsProduto,
      user_email: request.body.userEmail,
    };
  } catch (e) {
    console.error(`Erro ao parsear JSON para a chave ${key}:`, e);
    return null;
  }
}
// ------------------------------------------------------

// Util interno (não precisa exportar)
async function insertQuestions(pg, tableName, questions) {
  if (questions.length === 0) return [];

  const columns = [
    "nome",
    "ns",
    "linha",
    "familia",
    "setor",
    "sequencia",
    "descricao",
    "preenchimento",
    "codigo_pergunta",
    "value",
    "user_email",
  ];
  const numColumns = columns.length;

  const valuePlaceholders = questions
    .map(
      (_, idx) =>
        `($${idx * numColumns + 1}, $${idx * numColumns + 2}, $${idx * numColumns + 3}, $${idx * numColumns + 4},
          $${idx * numColumns + 5}, $${idx * numColumns + 6}, $${idx * numColumns + 7}, $${idx * numColumns + 8},
          $${idx * numColumns + 9}, $${idx * numColumns + 10}, $${idx * numColumns + 11})`
    )
    .join(", ");

  const insertQuery = `
    INSERT INTO ${tableName}
      (${columns.join(", ")})
    VALUES
      ${valuePlaceholders}
    RETURNING *;
  `;

  const values = questions.flatMap((row) => [
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

  const result = await pg.query(insertQuery, values);
  return result.rows;
}

// ------------------------------------------------------
// EXPORTADO COMO DEFAULT ✔
export default async function insertQueryWithUpload(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      success: false,
      error: "Método não permitido",
    });
  }

  try {
    await runMiddleware(request, response, upload.any());

    const questions = [];

    for (const key of Object.keys(request.body)) {
      const q = processQuestion(key, request);
      if (q) questions.push(q);
    }

    if (questions.length === 0) {
      return response
        .status(400)
        .json({ success: false, error: "Nenhum dado válido para salvar." });
    }

    const normal = questions.filter((q) => q.preenchimento !== "Foto");
    const images = questions.filter((q) => q.preenchimento === "Foto");

    const client = await pool.connect();

    let insertedNormal = [];
    let insertedImages = [];

    try {
      await client.query("BEGIN");

      insertedNormal = await insertQuestions(client, "clChecklist", normal);
      insertedImages = await insertQuestions(
        client,
        "clChecklistIMG",
        images
      );

      await client.query("COMMIT");
    } catch (dbError) {
      await client.query("ROLLBACK");
      console.error("Erro DB:", dbError);
      return response
        .status(500)
        .json({ success: false, error: "Falha ao inserir os dados no banco" });
    } finally {
      client.release();
    }

    return response.status(200).json({
      success: true,
      checklist: insertedNormal,
      imagens: insertedImages,
    });
  } catch (error) {
    if (
      error.code === "LIMIT_FILE_SIZE" ||
      error.code === "LIMIT_UNEXPECTED_FILE" ||
      error.name === "MulterError"
    ) {
      return response
        .status(400)
        .json({ success: false, error: `Falha no upload: ${error.message}` });
    }

console.error("Erro geral:", error);
return response
  .status(500)
  .json({ success: false, error: "Falha ao inserir os dados no banco" });

  }
}
