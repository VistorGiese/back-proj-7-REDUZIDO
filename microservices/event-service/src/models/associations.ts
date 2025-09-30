import BookingModel from './BookingModel';
import BandApplicationModel from './BandApplicationModel';

// Relacionamento Booking <-> BandApplication
BookingModel.hasMany(BandApplicationModel, {
  foreignKey: 'agendamento_id',
  as: 'Applications'
});

BandApplicationModel.belongsTo(BookingModel, {
  foreignKey: 'agendamento_id',
  as: 'Booking'
});

export {
  BookingModel,
  BandApplicationModel
};