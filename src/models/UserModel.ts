import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id?: number;
  email: string;
  senha: string;
  nome: string;
  created_at?: Date;
  updated_at?: Date;
}

class UserModel extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public senha!: string;
  public nome!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,
  }
);

export default UserModel;