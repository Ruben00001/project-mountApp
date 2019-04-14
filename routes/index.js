const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      req.flash('error', err.message);
      return res.redirect('register');
    }
    else passport.authenticate('local')(req, res, () => {
      res.redirect('/mountains');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login', {referer:req.headers.referer});
});

// router.post('/login', passport.authenticate('local', 
//   {
//     // successRedirect: '/mountains',
//     failureRedirect: '/login'
//   }), (req, res) => { 
//     res.redirect(req.body.referer);
// });

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) {      
      req.flash('error', 'Incorrect password/username');
      return res.redirect('/login');
    } 
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect(req.body.referer);
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/mountains');
});

module.exports = router;