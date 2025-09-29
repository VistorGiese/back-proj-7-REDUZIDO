import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class FavoriteModel extends Model {
  id!: number;
  estabelecimento_id!: number;
  banda_id!: number;
  data_favoritado!: Date;
}

FavoriteModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  estabelecimento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estabelecimentos',
      key: 'id',
    },
  },
  banda_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bandas',
      key: 'id',
    },
  },
  data_favoritado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Favorite',
  tableName: 'favoritos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['estabelecimento_id', 'banda_id'], // Evita favoritos duplicados
    },
  ],
});

export default FavoriteModel;