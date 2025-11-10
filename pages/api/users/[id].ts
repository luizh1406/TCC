// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db"; // ATENÇÃO: Ajuste este caminho conforme a localização real do seu db.ts
import bcrypt from "bcryptjs"; // Certifique-se de ter 'bcryptjs' instalado: npm install bcryptjs ou yarn add bcryptjs

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // Pega o ID da URL, que vem do frontend via `${editUserId}`

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  // Lida com requisições PUT para atualizar um usuário
  if (req.method === "PUT") {
    const { userName, email, password, sector, position, role, ramal } =
      req.body;

    // Validação básica dos campos obrigatórios
    if (!userName || !email || !sector || !position || !role || !ramal) {
      return res
        .status(400)
        .json({
          message:
            "Todos os campos obrigatórios (Nome, Email, Setor, Cargo, Privilégios, Ramal) devem ser preenchidos.",
        });
    }

    try {
      let hashedPassword = null;
      if (password) {
        // Se uma nova senha for fornecida no frontend, faça o hash dela
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      let queryText = `
        UPDATE users
        SET nome = $1, email = $2, setor = $3, cargo = $4, role = $5, ramal = $6
      `;
      let queryParams: (string | null)[] = [
        userName,
        email,
        sector,
        position,
        role,
        ramal,
      ];
      let paramIndex = 6; // O próximo índice de parâmetro no SQL

      if (hashedPassword) {
        // Adiciona a senha hashada à query se ela foi fornecida
        queryText += `, password_hash = $${paramIndex}`;
        queryParams.push(hashedPassword);
        paramIndex++;
      }

      queryText += ` WHERE id = $${paramIndex} RETURNING id;`; // Condição WHERE com o ID do usuário
      queryParams.push(id); // Adiciona o ID como o último parâmetro

      const result = await db.query(queryText, queryParams);

      if (result.rows.length > 0) {
        return res
          .status(200)
          .json({
            message: "Usuário atualizado com sucesso!",
            userId: result.rows[0].id,
          });
      } else {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado para atualização." });
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      // Erro de banco de dados ou outro erro interno
      return res
        .status(500)
        .json({ message: "Erro interno do servidor ao atualizar usuário." });
    }
  }

  // Método HTTP não permitido para outros métodos
  res.setHeader("Allow", ["PUT"]); // Apenas PUT é permitido para esta API, se DELETE não for implementado
  return res
    .status(405)
    .json({ message: `Método ${req.method} Não Permitido` });
}
