import BandModel from './BandModel';
import BandMemberModel from './BandMemberModel';

// Relacionamentos Band <-> BandMember
BandModel.hasMany(BandMemberModel, {
  foreignKey: 'banda_id',
  as: 'Members'
});

BandMemberModel.belongsTo(BandModel, {
  foreignKey: 'banda_id',
  as: 'Band'
});

export {
  BandModel,
  BandMemberModel
};