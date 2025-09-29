import UserModel from './UserModel';
import EstablishmentProfileModel from './EstablishmentProfileModel';
import ArtistProfileModel from './ArtistProfileModel';
import AddressModel from './AddressModel';
import BandModel from './BandModel';
import BandMemberModel from './BandMemberModel';
import BookingModel from './BookingModel';
import BandApplicationModel from './BandApplicationModel';
import EstablishmentModel from './EstablishmentModel';

// Associações UserModel com perfis
UserModel.hasMany(EstablishmentProfileModel, {
  foreignKey: 'user_id',
  as: 'EstablishmentProfiles',
});

EstablishmentProfileModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'User',
});

UserModel.hasMany(ArtistProfileModel, {
  foreignKey: 'user_id',
  as: 'ArtistProfiles',
});

ArtistProfileModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'User',
});

// Associações com endereços
EstablishmentProfileModel.belongsTo(AddressModel, {
  foreignKey: 'address_id',
  as: 'Address',
});

AddressModel.hasMany(EstablishmentProfileModel, {
  foreignKey: 'address_id',
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
  foreignKey: 'band_id',
  as: 'Members',
});

BandMemberModel.belongsTo(BandModel, {
  foreignKey: 'band_id',
  as: 'Band',
});

ArtistProfileModel.hasMany(BandMemberModel, {
  foreignKey: 'artist_profile_id',
  as: 'BandMemberships',
});

BandMemberModel.belongsTo(ArtistProfileModel, {
  foreignKey: 'artist_profile_id',
  as: 'ArtistProfile',
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
};