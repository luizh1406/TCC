// pages/api/registerUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '../../lib/db'; // Importa a sua conexão com o banco de dados

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    userName,    // Corresponde ao input 'nome'
    email,       // Corresponde ao input 'email'
    password,    // Corresponde ao input 'password_hash'
    sector,      // Corresponde ao input 'setor'
    position,    // Corresponde ao input 'cargo'
    role         // Corresponde ao input 'role'
  } = req.body;

  // 1. Validação dos dados de entrada
  if (!userName || !email || !password || !sector || !position || !role) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Formato de e-mail inválido.' });
  }

  try {
    // 2. Verificar se o e-mail já existe no banco de dados
    const userExists = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    // 3. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o salt rounds

    // 4. Inserir o novo usuário no banco de dados
    // IMPORTANTE: Certifique-se de que sua tabela 'users' no PostgreSQL tenha as colunas
    // 'nome', 'email', 'password_hash', 'setor', 'cargo', 'role'.
    const insertQuery = `
      INSERT INTO users (nome, email, password_hash, setor, cargo, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const values = [userName, email, hashedPassword, sector, position, role];
    const result = await db.query(insertQuery, values);

    // Opcional: Se precisar do ID do novo usuário
    const newUserId = result.rows[0].id;
    console.log('Novo usuário registrado com ID:', newUserId);

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: newUserId });

  } catch (error) {
    console.error('Erro no registro do usuário:', error);
    // Verifique se o erro é devido a uma restrição de unicidade ou outro erro do DB
    // Você pode adicionar mais lógica de tratamento de erro aqui
    return res.status(500).json({ message: 'Erro interno do servidor ao cadastrar usuário.' });
  }
}