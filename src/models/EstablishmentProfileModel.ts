import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface EstablishmentProfileAttributes {
  id?: number;
  user_id: number;
  business_name: string;
  business_type: 'bar' | 'casa_show' | 'restaurante' | 'club' | 'outro';
  description?: string;
  musical_genres: string;
  opening_hours: string;
  closing_hours: string;
  address_id: number;
  contact_phone: string;
  photos?: string; // JSON string
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class EstablishmentProfileModel extends Model<EstablishmentProfileAttributes> implements EstablishmentProfileAttributes {
  public id!: number;
  public user_id!: number;
  public business_name!: string;
  public business_type!: 'bar' | 'casa_show' | 'restaurante' | 'club' | 'outro';
  public description?: string;
  public musical_genres!: string;
  public opening_hours!: string;
  public closing_hours!: string;
  public address_id!: number;
  public contact_phone!: string;
  public photos?: string;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

EstablishmentProfileModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    business_type: {
      type: DataTypes.ENUM('bar', 'casa_show', 'restaurante', 'club', 'outro'),
      allowNull: false,
      defaultValue: 'bar',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    musical_genres: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    opening_hours: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    closing_hours: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'enderecos',
        key: 'id',
      },
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'EstablishmentProfile',
    tableName: 'establishment_profiles',
    timestamps: true,
    underscored: true,
  }
);

export default EstablishmentProfileModel;