-- Inicialização do Banco TocaAqui
-- Este arquivo é executado automaticamente quando o container MySQL é criado

USE toca_aqui_v4;

-- Verificar se o banco foi criado corretamente
SELECT 'Banco de dados TocaAqui inicializado com sucesso!' as status;

-- As tabelas serão criadas automaticamente pelo Sequelize.sync()
-- através da aplicação Node.js