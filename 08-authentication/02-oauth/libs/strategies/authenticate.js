const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  let user;

  if (!email) {
    return done(null, false, 'Не указан email');
  }

  user = await User.findOne({email});

  if (!user) {
    user = new User({ email, displayName });
    const err = user.validateSync();
    if (err) {
      return done(err);
    }
    await user.save();
  }
  done(null, user);
};