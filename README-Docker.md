# 🐳 Docker Setup - TocaAqui

## 🚀 **Início Rápido**

### 1. **Subir Ambiente Completo**
```bash
npm run docker:up
```

### 2. **Verificar Logs**
```bash
npm run docker:logs
```

### 3. **Acessar Aplicação**
- **API**: http://localhost:3000
- **Adminer (MySQL GUI)**: http://localhost:8080
- **MySQL Direto**: localhost:3307

---

## 📋 **Comandos Docker Disponíveis**

### 🔧 **Comandos Básicos**
```bash
# Subir todos os serviços
npm run docker:up

# Parar todos os serviços  
npm run docker:down

# Reiniciar apenas a aplicação
npm run docker:restart

# Ver logs em tempo real
npm run docker:logs
```

### 🐚 **Acesso aos Containers**
```bash
# Shell na aplicação
npm run docker:shell

# MySQL CLI
npm run docker:mysql
```

### 🔨 **Build e Manutenção**
```bash
# Build da imagem
npm run docker:build

# Rebuild completo
docker-compose up --build -d

# Limpar tudo
docker-compose down -v --rmi all
```

---

## 🏗️ **Estrutura dos Containers**

### 📦 **Serviços Incluídos**
1. **app** - Aplicação Node.js (porta 3000)
2. **mysql** - Banco de dados MySQL 8.0 (porta 3306)  
3. **adminer** - Interface web MySQL (porta 8080)

### 🔌 **Portas Mapeadas**
- `3000` → API TocaAqui
- `3307` → MySQL Database
- `8080` → Adminer (GUI MySQL)

### 💾 **Volumes Persistentes**
- `mysql_data` → Dados do MySQL
- `.:/app` → Código fonte (hot reload)

---

## 🛠️ **Desenvolvimento com Dev Containers**

### VS Code Dev Container
```bash
# 1. Instalar extensão "Dev Containers"
# 2. Pressionar Ctrl+Shift+P
# 3. Executar: "Dev Containers: Reopen in Container"
```

### Vantagens do Dev Container
- ✅ Ambiente idêntico para todos os devs
- ✅ Extensões VS Code automáticas
- ✅ Debug direto no container
- ✅ Hot reload mantido

---

## 🔍 **Monitoramento e Debug**

### Health Checks
```bash
# Status dos containers
docker-compose ps

# Health do MySQL
docker-compose exec mysql mysqladmin ping
```

### Logs Detalhados
```bash
# Logs específicos por serviço
docker-compose logs app
docker-compose logs mysql
docker-compose logs adminer
```

### Métricas dos Containers
```bash
# Uso de recursos
docker stats

# Informações detalhadas
docker-compose exec app top
```

---

## ⚙️ **Configuração MCP**

### MCP Servers Configurados
1. **Docker MCP Server** - Gestão automática de containers
2. **Copilot MCP** - AI assistant para Docker
3. **MCP Server Runner** - Execução local de servers

### Comandos MCP
```bash
# Listar MCP servers ativos
npx mcp-server-runner list

# Instalar novo MCP server
npx copilot-mcp install docker-manager
```

---

## 🚨 **Troubleshooting**

### Problemas Comuns

#### 🔴 **Container não inicia**
```bash
# Verificar logs
docker-compose logs app

# Rebuild forçado
docker-compose up --build --force-recreate
```

#### 🔴 **Erro de conexão MySQL**
```bash
# Verificar se MySQL está pronto
docker-compose exec mysql mysqladmin ping

# Reiniciar apenas MySQL
docker-compose restart mysql
```

#### 🔴 **Porta já em uso**
```bash
# Verificar processo usando porta
netstat -tulpn | grep :3000

# Parar container específico
docker-compose stop app
```

### Reset Completo
```bash
# Parar tudo e limpar volumes
docker-compose down -v

# Remover imagens
docker-compose down --rmi all

# Rebuild do zero
docker-compose up --build -d
```

---

## 🎯 **Próximos Passos**

### ✅ **Implementado**
- [x] Containerização do monolito
- [x] Docker Compose configurado
- [x] Dev Container pronto
- [x] MCP servers instalados

### 🎯 **Próximas Fases**
- [ ] CI/CD com containers
- [ ] Kubernetes deployment
- [ ] Separação em microserviços
- [ ] Registry privado

---

**🐳 Ambiente Docker TocaAqui configurado e pronto para desenvolvimento!**