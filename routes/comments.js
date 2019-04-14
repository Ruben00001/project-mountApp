const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams merges params from mountains and comments together. So can access mountains/:id
const Mountain = require('../models/mountain');
const Comment = require('../models/comment');
const isLoggedIn = require('../middleware').isLoggedIn;
const isCommentAuthor = require('../middleware').isCommentAuthor;

// COMMENTS NEW
router.get('/new', isLoggedIn, (req, res) => {
  Mountain.findById(req.params.id, (err, mountain) => {
    if(err) {
      console.log(err);
    }
    else res.render('comments/new', {mountain: mountain});
  });
});

// COMMENTS CREATE
router.post('/', isLoggedIn, (req, res) => {
  Mountain.findById(req.params.id, (err, mountain) => {
    if(err) console.log(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) console.log(err);
        else {  
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();        
          mountain.comments.push(comment);
          mountain.save();
          res.redirect('/mountains/' + mountain._id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', isCommentAuthor, (req, res) => {  
  Comment.findById(req.params.comment_id, (err, comment) => {
    if(err) {
      console.log(err);      
    } else {
      res.render('comments/edit', {
        comment: comment,
        mountain_id: req.params.id // id in app.js tied to 'mountains': app.use('/mountains/:id/comments', commentRoutes);
      });
    }
  });
});

router.put('/:comment_id', isCommentAuthor, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if(err) {
      console.log(err);      
    } else {
      res.redirect('/mountains');
    }
  });
});

router.delete('/:comment_id', isCommentAuthor, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    if(err) {
      console.log(err);      
    } else {      
      res.redirect('/mountains/' + req.params.id);
    }
  });
});


module.exports = router;