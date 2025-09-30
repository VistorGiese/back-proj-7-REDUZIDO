// Arquivo para definir todas as associações entre modelos
import UserModel from './UserModel';
import EstablishmentProfileModel from './EstablishmentProfileModel';
import ArtistProfileModel from './ArtistProfileModel';
import AddressModel from './AddressModel';
import BandModel from './BandModel';
import BandMemberModel from './BandMemberModel';
import BookingModel from './BookingModel';
import BandApplicationModel from './BandApplicationModel';
import EstablishmentModel from './EstablishmentModel';
import FavoriteModel from './FavoriteModel';

// Associações do novo sistema de usuários
UserModel.hasMany(EstablishmentProfileModel, {
  foreignKey: 'usuario_id',
  as: 'EstablishmentProfiles',
});

EstablishmentProfileModel.belongsTo(UserModel, {
  foreignKey: 'usuario_id',
  as: 'User',
});

UserModel.hasMany(ArtistProfileModel, {
  foreignKey: 'usuario_id',
  as: 'ArtistProfiles',
});

ArtistProfileModel.belongsTo(UserModel, {
  foreignKey: 'usuario_id',
  as: 'User',
});

// Associações com endereços
EstablishmentProfileModel.belongsTo(AddressModel, {
  foreignKey: 'endereco_id',
  as: 'Address',
});

AddressModel.hasMany(EstablishmentProfileModel, {
  foreignKey: 'endereco_id',
  as: 'EstablishmentProfiles',
});

// Associações existentes (manter compatibilidade)
EstablishmentModel.belongsTo(AddressModel, {
  foreignKey: 'endereco_id',
  as: 'Address',
});

AddressModel.hasMany(EstablishmentModel, {
  foreignKey: 'endereco_id',
  as: 'Establishments',
});

BandModel.hasMany(BookingModel, {
  foreignKey: 'banda_id',
  as: 'Bookings',
});

BookingModel.belongsTo(BandModel, {
  foreignKey: 'banda_id',
  as: 'Band',
});

EstablishmentModel.hasMany(BookingModel, {
  foreignKey: 'estabelecimento_id',
  as: 'Bookings',
});

BookingModel.belongsTo(EstablishmentModel, {
  foreignKey: 'estabelecimento_id',
  as: 'Establishment',
});

BandModel.hasMany(BandApplicationModel, {
  foreignKey: 'banda_id',
  as: 'Applications',
});

BandApplicationModel.belongsTo(BandModel, {
  foreignKey: 'banda_id',
  as: 'Band',
});

BookingModel.hasMany(BandApplicationModel, {
  foreignKey: 'evento_id',
  as: 'Applications',
});

BandApplicationModel.belongsTo(BookingModel, {
  foreignKey: 'evento_id',
  as: 'Event',
});

// Associações do novo sistema de bandas
BandModel.hasMany(BandMemberModel, {
  foreignKey: 'banda_id',
  as: 'Members',
});

BandMemberModel.belongsTo(BandModel, {
  foreignKey: 'banda_id',
  as: 'Band',
});

ArtistProfileModel.hasMany(BandMemberModel, {
  foreignKey: 'perfil_artista_id',
  as: 'BandMemberships',
});

BandMemberModel.belongsTo(ArtistProfileModel, {
  foreignKey: 'perfil_artista_id',
  as: 'ArtistProfile',
});

// Sistema de favoritos
FavoriteModel.belongsTo(EstablishmentModel, {
  foreignKey: 'estabelecimento_id',
  as: 'Establishment',
});

EstablishmentModel.hasMany(FavoriteModel, {
  foreignKey: 'estabelecimento_id',
  as: 'Favorites',
});

FavoriteModel.belongsTo(BandModel, {
  foreignKey: 'banda_id',
  as: 'Band',
});

BandModel.hasMany(FavoriteModel, {
  foreignKey: 'banda_id',
  as: 'Favorites',
});

export {
  UserModel,
  EstablishmentProfileModel,
  ArtistProfileModel,
  AddressModel,
  BandModel,
  BandMemberModel,
  BookingModel,
  BandApplicationModel,
  EstablishmentModel,
  FavoriteModel,
};