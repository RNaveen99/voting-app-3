const passport = require('passport');
require('./strategies/local.strategy')();
const { findUser } = require('../controllers/helpers/mongo')();

module.exports = function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // passport.serializeUser((user, done) => {
  //   done(null, user);
  // });

  // passport.deserializeUser((user, done) => {
  //   done(null, user);
  // });

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    findUser(_id).then((user) => {
      done(null, user);
    }).catch((err)=>{})
  });
}