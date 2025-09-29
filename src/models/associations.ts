// Arquivo para definir todas as associações entre modelos
import EstablishmentModel from './EstablishmentModel';
import BandModel from './BandModel';
import BookingModel from './BookingModel';
import AddressModel from './AddressModel';
import BandApplicationModel from './BandApplicationModel';
import FavoriteModel from './FavoriteModel';

EstablishmentModel.belongsTo(AddressModel, { 
  foreignKey: 'endereco_id', 
  as: 'Address' 
});
AddressModel.hasMany(EstablishmentModel, { 
  foreignKey: 'endereco_id', 
  as: 'Establishments' 
});

BookingModel.belongsTo(EstablishmentModel, { 
  foreignKey: 'estabelecimento_id', 
  as: 'Establishment' 
});
EstablishmentModel.hasMany(BookingModel, { 
  foreignKey: 'estabelecimento_id', 
  as: 'Bookings' 
});

BookingModel.belongsTo(BandModel, { 
  foreignKey: 'banda_id', 
  as: 'Band' 
});
BandModel.hasMany(BookingModel, { 
  foreignKey: 'banda_id', 
  as: 'Bookings' 
});

BandApplicationModel.belongsTo(BandModel, { 
  foreignKey: 'banda_id', 
  as: 'Band' 
});
BandModel.hasMany(BandApplicationModel, { 
  foreignKey: 'banda_id', 
  as: 'Applications' 
});

BandApplicationModel.belongsTo(BookingModel, { 
  foreignKey: 'evento_id', 
  as: 'Booking' 
});
BookingModel.hasMany(BandApplicationModel, { 
  foreignKey: 'evento_id', 
  as: 'Applications' 
});

FavoriteModel.belongsTo(EstablishmentModel, { 
  foreignKey: 'estabelecimento_id', 
  as: 'Establishment' 
});
EstablishmentModel.hasMany(FavoriteModel, { 
  foreignKey: 'estabelecimento_id', 
  as: 'Favorites' 
});

FavoriteModel.belongsTo(BandModel, { 
  foreignKey: 'banda_id', 
  as: 'Band' 
});
BandModel.hasMany(FavoriteModel, { 
  foreignKey: 'banda_id', 
  as: 'Favorites' 
});

export {
  EstablishmentModel,
  BandModel,
  BookingModel,
  AddressModel,
  BandApplicationModel,
  FavoriteModel
};