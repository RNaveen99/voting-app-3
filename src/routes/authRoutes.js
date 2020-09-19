const express = require('express');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
const { signUpPost } = require('../controllers/authController')();
const { ifSignIn, ifNotSignIn, ifSignInAdmin } = require('../controllers/helpers/restrictions')();

const authRouter = express.Router();

const router = () => {
  authRouter
    .route('/signUp')
    .all(ifNotSignIn)
    .get((req, res) => {
      // res.render('signUp');
      res.redirect('signin')
    })
    .post((req, res) => {
      res.redirect('signin')

      // signUpPost
    });

  authRouter
    .route('/signIn')
    .all(ifNotSignIn)
    .get((req, res) => {
      debug(req.session);
      res.render('signIn');
    })
    .post(
      passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/auth/signIn',
      })
    );

  authRouter
    .route('/profile')
    .all(ifSignIn)
    .get((req, res) => {
      debug(req.session);
      const { user } = req;
      res.render('profile', { user });
    });

  authRouter
    .route('/signOut')
    .all(ifSignIn)
    .get((req, res) => {
      req.logOut();
      req.session.destroy();
      res.redirect('/auth/signIn');
    });
  
  return authRouter;
};

module.exports = router;
