import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_NAME || !process.env.DB_USER) {
  throw new Error('Variáveis de ambiente DB_NAME e DB_USER são obrigatórias');
}


const sequelize = new Sequelize(
  process.env.DB_NAME || 'bands_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'rootpassword', 
  {
    host: process.env.DB_HOST || 'band-db',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT.toString()) : 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+00:00', 
  }
);

export default sequelize;