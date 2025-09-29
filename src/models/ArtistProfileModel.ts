import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface ArtistProfileAttributes {
  id?: number;
  user_id: number;
  stage_name: string;
  bio?: string;
  instruments: string; // JSON array
  genres: string; // JSON array
  experience_years?: number;
  portfolio_url?: string;
  profile_photo?: string;
  is_available?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class ArtistProfileModel extends Model<ArtistProfileAttributes> implements ArtistProfileAttributes {
  public id!: number;
  public user_id!: number;
  public stage_name!: string;
  public bio?: string;
  public instruments!: string;
  public genres!: string;
  public experience_years?: number;
  public portfolio_url?: string;
  public profile_photo?: string;
  public is_available!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ArtistProfileModel.init(
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
    stage_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instruments: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: '[]',
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: '[]',
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    portfolio_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profile_photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'ArtistProfile',
    tableName: 'artist_profiles',
    timestamps: true,
    underscored: true,
  }
);

export default ArtistProfileModel;