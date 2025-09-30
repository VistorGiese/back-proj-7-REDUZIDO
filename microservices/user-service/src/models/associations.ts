import UserModel from './UserModel';
import EstablishmentProfileModel from './EstablishmentProfileModel';
import ArtistProfileModel from './ArtistProfileModel';
import AddressModel from './AddressModel';

// Relacionamentos entre User e os Perfis
UserModel.hasOne(EstablishmentProfileModel, {
  foreignKey: 'usuario_id',
  as: 'EstablishmentProfiles'
});

UserModel.hasOne(ArtistProfileModel, {
  foreignKey: 'usuario_id', 
  as: 'ArtistProfiles'
});

EstablishmentProfileModel.belongsTo(UserModel, {
  foreignKey: 'usuario_id',
  as: 'User'
});

ArtistProfileModel.belongsTo(UserModel, {
  foreignKey: 'usuario_id',
  as: 'User'
});

// Associação polimórfica de endereços
UserModel.hasMany(AddressModel, {
  foreignKey: 'entidade_id',
  constraints: false,
  scope: {
    entidade_tipo: 'usuario'
  },
  as: 'Address'
});

EstablishmentProfileModel.hasMany(AddressModel, {
  foreignKey: 'entidade_id',
  constraints: false,
  scope: {
    entidade_tipo: 'perfil_estabelecimento'
  },
  as: 'Address'
});

ArtistProfileModel.hasMany(AddressModel, {
  foreignKey: 'entidade_id',
  constraints: false,
  scope: {
    entidade_tipo: 'perfil_artista'
  },
  as: 'Address'
});

export {
  UserModel,
  EstablishmentProfileModel,
  ArtistProfileModel,
  AddressModel
};