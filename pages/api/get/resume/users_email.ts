// pages/api/get/resume/users_email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../lib/db"; // Ajuste o caminho conforme a localização do seu db.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { email } = req.query; // Pega o email dos parâmetros da URL

    if (!email || typeof email !== "string") {
      // Sempre retorne JSON, mesmo em caso de erro
      return res
        .status(400)
        .json({ message: "E-mail é obrigatório para a busca." });
    }

    try {
      const result = await db.query(
        "SELECT id, nome, email, setor, cargo, role, ramal FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length > 0) {
        // Retorne o usuário, mas NUNCA a senha hashada para o frontend
        return res.status(200).json({ user: result.rows[0] });
      } else {
        // Usuário não encontrado, retorne um status 404 com JSON
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      // Erro interno do servidor, retorne um status 500 com JSON
      return res
        .status(500)
        .json({ message: "Erro interno do servidor ao buscar usuário." });
    }
  } else {
    // Método não permitido, retorne um status 405 com JSON
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Método ${req.method} Não Permitido` });
  }
}
