import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models/associations'; // Importar associações

// Rotas
import UserRoutes from './routes/UserRoutes';
import AddressRoutes from './routes/AddressRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'user-service',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Rotas
app.use('/usuarios', UserRoutes);
app.use('/enderecos', AddressRoutes);

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ User Service - Conexão com o banco estabelecida');
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ User Service - Modelos sincronizados');
    }

    app.listen(PORT, () => {
      console.log(`🚀 User Service rodando na porta ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar User Service:', error);
    process.exit(1);
  }
};

startServer();

export default app;