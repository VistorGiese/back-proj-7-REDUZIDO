import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const BAND_SERVICE_URL = process.env.BAND_SERVICE_URL || 'http://band-service:3002';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://event-service:3003';
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL || 'http://social-service:3004';

// Helper function para proxy manual
const proxyRequest = async (req: express.Request, res: express.Response, targetUrl: string, path: string) => {
  try {
    const url = `${targetUrl}${path}`;
    const method = req.method.toLowerCase();
    
    let response;
    const headers = {
      'Content-Type': 'application/json'
    };
    
    switch (method) {
      case 'get':
        response = await fetch(url, {
          method: 'GET',
          headers
        });
        break;
      case 'post':
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(req.body)
        });
        break;
      case 'put':
        response = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(req.body)
        });
        break;
      case 'delete':
        response = await fetch(url, {
          method: 'DELETE',
          headers
        });
        break;
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const data = await response.json().catch(() => ({}));
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error(`Erro no proxy para ${targetUrl}${path}:`, error);
    res.status(503).json({ 
      error: 'Serviço temporariamente indisponível',
      service: targetUrl 
    });
  }
};

// Routes - User Service
app.all('/api/usuarios*', (req, res) => {
  const path = req.path.replace('/api/usuarios', '/usuarios');
  proxyRequest(req, res, USER_SERVICE_URL, path);
});

app.all('/api/enderecos*', (req, res) => {
  const path = req.path.replace('/api/enderecos', '/enderecos');
  proxyRequest(req, res, USER_SERVICE_URL, path);
});

// Routes - Band Service
app.all('/api/bandas*', (req, res) => {
  const path = req.path.replace('/api/bandas', '/bandas');
  proxyRequest(req, res, BAND_SERVICE_URL, path);
});

app.all('/api/band-management*', (req, res) => {
  const path = req.path.replace('/api/band-management', '/band-management');
  proxyRequest(req, res, BAND_SERVICE_URL, path);
});

// Routes - Event Service
app.all('/api/agendamentos*', (req, res) => {
  const path = req.path.replace('/api/agendamentos', '/agendamentos');
  proxyRequest(req, res, EVENT_SERVICE_URL, path);
});

app.all('/api/aplicacoes-banda*', (req, res) => {
  const path = req.path.replace('/api/aplicacoes-banda', '/aplicacoes-banda');
  proxyRequest(req, res, EVENT_SERVICE_URL, path);
});

// Routes - Social Service
app.all('/api/favoritos*', (req, res) => {
  const path = req.path.replace('/api/favoritos', '/favoritos');
  proxyRequest(req, res, SOCIAL_SERVICE_URL, path);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: {
      'user-service': USER_SERVICE_URL,
      'band-service': BAND_SERVICE_URL,
      'event-service': EVENT_SERVICE_URL,
      'social-service': SOCIAL_SERVICE_URL
    }
  });
});

// Services health check
app.get('/health/services', async (req, res) => {
  const healthChecks = [];
  
  const services = [
    { name: 'user-service', url: `${USER_SERVICE_URL}/health` },
    { name: 'band-service', url: `${BAND_SERVICE_URL}/health` },
    { name: 'event-service', url: `${EVENT_SERVICE_URL}/health` },
    { name: 'social-service', url: `${SOCIAL_SERVICE_URL}/health` }
  ];

  for (const service of services) {
    try {
      const response = await fetch(service.url);
      healthChecks.push({
        service: service.name,
        status: response.ok ? 'OK' : 'ERROR',
        url: service.url
      });
    } catch (error) {
      healthChecks.push({
        service: service.name,
        status: 'ERROR',
        error: 'Service unavailable',
        url: service.url
      });
    }
  }

  res.json({
    gateway: 'OK',
    timestamp: new Date().toISOString(),
    services: healthChecks
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway Error:', error);
  res.status(500).json({ 
    error: 'Erro interno do gateway',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 API Gateway rodando na porta ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Services health: http://localhost:${PORT}/health/services`);
  console.log(`🎯 Routes:`);
  console.log(`   - /api/usuarios -> ${USER_SERVICE_URL}`);
  console.log(`   - /api/bandas -> ${BAND_SERVICE_URL}`);
  console.log(`   - /api/agendamentos -> ${EVENT_SERVICE_URL}`);
  console.log(`   - /api/favoritos -> ${SOCIAL_SERVICE_URL}`);
});

export default app;