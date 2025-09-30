import { NextFunction, Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: { id: number; email?: string };
}

// Middleware simplificado para Social Service
// A autenticação é feita pelo Gateway que encaminha o user_id
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Verifica se o user_id foi enviado pelo Gateway
  const userId = req.headers["x-user-id"] as string;
  
  if (!userId) {
    return res.status(401).json({ erro: "Usuário não identificado" });
  }

  // Adiciona o user ao request
  req.user = { id: parseInt(userId) };
  next();
};