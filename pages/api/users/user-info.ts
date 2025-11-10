// pages/api/user-info.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie'; // Para analisar os cookies da requisição

// Interface para o payload do seu token
interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name: string; // Garantindo que 'name' está aqui
  iat: number;
  exp: number;
}

export default async function userInfoHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // 1. Obter o token do cookie
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado: Token não encontrado.' });
  }

  try {
    // 2. Decodificar e verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    // 3. Retornar as informações do usuário para o cliente
    // Você pode retornar apenas as informações que são seguras para o frontend.
    return res.status(200).json({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    });

  } catch (error) {
    console.error('Erro ao verificar token na rota /api/user-info:', error);
    // Se o token for inválido ou expirado, limpar o cookie e retornar erro
    res.setHeader('Set-Cookie', serialize('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0, // Expira imediatamente
    }));
    return res.status(401).json({ error: 'Não autorizado: Token inválido ou expirado.' });
  }
}