
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface BandAttributes {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
  genres?: string; // JSON array
  founded_date?: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  // Campos antigos para compatibilidade
  nome_banda?: string;
  descricao?: string;
  imagem?: string;
  data_criacao?: Date;
}

class BandModel extends Model<BandAttributes> implements BandAttributes {
  public id!: number;
  public name?: string;
  public description?: string;
  public image?: string;
  public genres?: string;
  public founded_date?: Date;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Campos antigos para compatibilidade
  public nome_banda?: string;
  public descricao?: string;
  public imagem?: string;
  public data_criacao?: Date;
}

BandModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '[]',
    },
    founded_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Campos antigos para compatibilidade
    nome_banda: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Band',
    tableName: 'bands',
    timestamps: true,
    underscored: true,
  }
);

export default BandModel;