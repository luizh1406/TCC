import fs from "fs";
import path from "path";
import multer from "multer";
import pool from "../../database.js"; // Usando seu pool de conexão existente

// Configuração do Multer para lidar com o upload de arquivos.
// Usamos o diretório temporário para ser compatível com ambientes serverless (como Next.js/Vercel).
const upload = multer({ dest: path.join(process.env.NODE_ENV === 'development' ? 'uploads' : '/tmp') });

// Exporta a configuração para desabilitar o bodyParser padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Envolve a execução de um middleware do Express (como o Multer) em uma Promise.
 * Isso permite usar async/await e evita o aninhamento de callbacks.
 * * Complexidade Cognitiva: 1
 */
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

/**
 * Processa a informação de uma única pergunta do corpo da requisição.
 * Lida com o parsing do JSON de info e a leitura/limpeza de arquivos de foto.
 * * Complexidade Cognitiva: 3
 */
function processQuestion(key, request) {
  if (!key.endsWith("_info")) return null;

  try {
    const info = JSON.parse(request.body[key]);
    const code = info.codigo_pergunta;
    let value = null;

    if (info.preenchimento === "Foto") {
      const file = request.files.find((f) => f.fieldname === code);
      if (file) {
        // Lê o buffer da imagem e limpa o arquivo temporário
        const imageBuffer = fs.readFileSync(file.path);
        value = imageBuffer;
        // Limpar o arquivo temporário é crucial
        fs.unlinkSync(file.path);
      }
    } else {
      // Valor de preenchimento normal (texto, número, etc.)
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

/**
 * Insere múltiplas perguntas em uma tabela do PostgreSQL de forma otimizada (multi-row insert).
 * Otimizado para usar a lógica de query que você já tinha.
 * * Complexidade Cognitiva: 1
 */
async function insertQuestions(pg, tableName, questions) {
  if (questions.length === 0) return [];

  const columns = [
    "nome", "ns", "linha", "familia", "setor", "sequencia", "descricao",
    "preenchimento", "codigo_pergunta", "value", "user_email"
  ];
  const numColumns = columns.length;

  const valuePlaceholders = questions
    .map(
      (_, idx) =>
        `($${idx * numColumns + 1}, $${idx * numColumns + 2}, $${idx * numColumns + 3}, $${
          idx * numColumns + 4
        }, $${idx * numColumns + 5}, $${idx * numColumns + 6}, $${idx * numColumns + 7}, $${
          idx * numColumns + 8
        }, $${idx * numColumns + 9}, $${idx * numColumns + 10}, $${idx * numColumns + 11})`
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

/**
 * Função principal refatorada para inserir dados de checklist.
 * * Complexidade Cognitiva Reduzida: 10 (Target: <= 15)
 */
export default async function insertQueryWithUpload(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      success: false,
      error: "Método não permitido",
    });
  }

  // A Complexidade Cognitiva diminuiu drasticamente aqui
  try {
    // 1. Executa o middleware Multer de forma assíncrona
    await runMiddleware(request, response, upload.any());

    // 2. Processa todas as perguntas
    const dataKeys = Object.keys(request.body);
    const questions = [];

    console.log("FILES RECEBIDOS:", request.files);
    console.log("BODY RECEBIDO:", request.body);

    for (const key of dataKeys) {
      const question = processQuestion(key, request);
      if (question) {
        questions.push(question);
      }
    }

    // 3. Validação
    if (questions.length === 0) {
      return response.status(400).json({
        success: false,
        error: "Nenhum dado válido para salvar.",
      });
    }

    // 4. Separação de dados
    const normalQuestions = questions.filter(
      (q) => q.preenchimento !== "Foto"
    );
    const imageQuestions = questions.filter(
      (q) => q.preenchimento === "Foto"
    );

    // 5. Inserção no DB (usando o pool que você importou)
    // O pool aqui já está sendo usado como um cliente, vamos manter a simplicidade se ele for um pool singleton
    let insertedNormal = [];
    let insertedImages = [];

    // Usando uma transação para garantir que ambas as inserções funcionem ou falhem juntas
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Inicia a transação
        
        insertedNormal = await insertQuestions(client, 'clChecklist', normalQuestions);
        insertedImages = await insertQuestions(client, 'clChecklistIMG', imageQuestions);
        
        await client.query('COMMIT'); // Finaliza a transação com sucesso

    } catch (dbError) {
        await client.query('ROLLBACK'); // Desfaz tudo em caso de erro
        console.error("Erro ao inserir os dados no DB:", dbError);
        // Retorna erro específico de DB
        return response
            .status(500)
            .json({ success: false, error: "Falha ao inserir os dados no banco de dados" });
    } finally {
        client.release(); // Libera o cliente
    }

    console.log("Dados inseridos:", {
      checklist: insertedNormal,
      imagens: insertedImages,
    });

    return response.status(200).json({
      success: true,
      message: "Dados do checklist inseridos com sucesso.",
      checklist: insertedNormal,
      imagens: insertedImages,
    });

  } catch (error) {
    // Lida com erros do Multer (upload) ou erros gerais de processamento
    if (error.code === 'LIMIT_FILE_SIZE' || error.code === 'LIMIT_UNEXPECTED_FILE' || error.name === 'MulterError') {
      console.error("Erro de Multer/Upload:", error);
      return response
        .status(400)
        .json({ success: false, error: `Falha no upload: ${error.message}` });
    }

    console.error("Erro geral no servidor:", error);
    return response
      .status(500)
      .json({ success: false, error: "Falha interna no servidor" });
  }
}