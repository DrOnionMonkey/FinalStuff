var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  securityQ: String,
  securityA: String,
  money: {type: Number, default: 500},
  matches: {type: Number, default: 0},
  wins: {type: Number, default: 0},
  losses: {type: Number, default: 0}
//  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

UserSchema.methods.upmatches = function(cb) {
  this.matches += 1;
  this.save(cb);
};

UserSchema.methods.upwins = function(cb) {
  this.wins += 1;
  this.save(cb);
};
 
UserSchema.methods.uploses = function(cb) {
  this.losses += 1;
  this.save(cb);
};

UserSchema.methods.moneymanip = function(change,cb) {
  this.money += change;
  this.save(cb);
};


mongoose.model('User', UserSchema);
