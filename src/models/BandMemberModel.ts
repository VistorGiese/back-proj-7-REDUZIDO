import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface BandMemberAttributes {
  id?: number;
  band_id: number;
  artist_profile_id: number;
  role?: string;
  is_leader?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  joined_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

class BandMemberModel extends Model<BandMemberAttributes> implements BandMemberAttributes {
  public id!: number;
  public band_id!: number;
  public artist_profile_id!: number;
  public role?: string;
  public is_leader!: boolean;
  public status!: 'pending' | 'approved' | 'rejected';
  public joined_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BandMemberModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bands',
        key: 'id',
      },
    },
    artist_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artist_profiles',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Função na banda (ex: guitarrista, vocalista, baterista)',
    },
    is_leader: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'BandMember',
    tableName: 'band_members',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['band_id', 'artist_profile_id'],
        name: 'unique_band_artist_membership',
      },
    ],
  }
);

export default BandMemberModel;