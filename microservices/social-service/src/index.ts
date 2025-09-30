import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models/associations';

// Rotas
import FavoriteRoutes from './routes/FavoriteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/favoritos', FavoriteRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'social-service',
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Conectar ao banco e iniciar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Social Service - Conexão com o banco estabelecida');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Social Service - Modelos sincronizados');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Social Service rodando na porta ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar Social Service:', error);
    process.exit(1);
  }
};

startServer();

export default app;