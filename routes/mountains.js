const express = require('express');
const router = express.Router();
const Mountain = require('../models/mountain');
const isLoggedIn = require('../middleware').isLoggedIn; // index.js is default so don't need to write /middleware/index
const isMountainAuthor = require('../middleware').isMountainAuthor;

router.get('/', (req, res) => {
  Mountain.find({}, (err, mountains) => {
    if (err) console.log(err);
    else res.render('mountains/mountains', {mountains: mountains, message: req.flash('info')});
    // req.user provided by Passport
  });
});

router.post('/', isLoggedIn, (req, res) => {
  Mountain.create({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: {
      id: req.user._id,
      username: req.user.username
    }
    }, (err, mountain) => {
      if(err) {
        console.log(err);
      } else {
        console.log(mountain);     
        req.flash('info', 'Mountain Posted');   
        res.redirect('/mountains');
      }   
  });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('mountains/new');
});

router.get('/:id', (req, res) => {
  Mountain.findById(req.params.id).populate('comments').exec((err, mountain) => {
    if (err) res.redirect('/mountains');
    else {   
      res.render('mountains/show', {mountain: mountain});
    }
  });
});

router.get('/:id/edit', isMountainAuthor, (req, res) => {
    Mountain.findById(req.params.id, (err, mountain) => {
      res.render('mountains/edit', {mountain: mountain});
    });
});

router.put('/:id', isMountainAuthor, (req, res) => {
  Mountain.findByIdAndUpdate(req.params.id, req.body.mountain, (err, mountain) => {
    if(err) console.log(err);
    else {
      res.redirect('/mountains/' + req.params.id);
    }
  })
});

router.delete('/:id', isMountainAuthor, (req, res) => {
  Mountain.findByIdAndRemove(req.params.id, (err) => {
    if(err) console.log(err);
    else {
      res.redirect('/mountains');
    }
  });
});

module.exports = router;