import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models/associations';

// Rotas
import BookingRoutes from './routes/BookingRoutes';
import BandApplicationRoutes from './routes/BandApplicationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/agendamentos', BookingRoutes);
app.use('/aplicacoes-banda', BandApplicationRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'event-service',
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
    console.log('✅ Event Service - Conexão com o banco estabelecida');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Event Service - Modelos sincronizados');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Event Service rodando na porta ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar Event Service:', error);
    process.exit(1);
  }
};

startServer();

export default app;