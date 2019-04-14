const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const methodOverride = require('method-override');


const commentRoutes     = require('./routes/comments'),
      mountainRoutes    = require('./routes/mountains'),
      authRoutes        = require('./routes/index');

mongoose.connect('mongodb://localhost/mountainApp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
app.use(require('express-session')({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false  
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.flashError = req.flash('error');
  res.locals.flashSuccess = req.flash('success');
  next();
});
// anything put in res.locals is available in ejs files

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use('/mountains/:id/comments', commentRoutes);
app.use('/mountains', mountainRoutes);


app.listen(3000, () => {
  console.log('Mountain App has started listening on port 3000...');  
});
