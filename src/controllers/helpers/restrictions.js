const debug = require('debug')('app:restrictions');

const restrictions = () => {
  const ifSignIn = (req, res, next) => {
    if (!req.user) {
      return res.redirect('/auth/signIn');
    }
    next();
  };
  const ifSignInAdmin = (req, res, next) => {
    if (!req.user) {
      return res.redirect('/auth/signIn');
    }
    if (req.user.privileges === 'user') {
      return res.redirect('/auth/profile');
    }
    next();
  };

  const ifNotSignIn = (req, res, next) => {
    if (req.user) {
      return res.redirect('/auth/profile');
    }
    next();
  };

  return {
    ifSignIn,
    ifNotSignIn,
    ifSignInAdmin,
  };
};

module.exports = restrictions;
