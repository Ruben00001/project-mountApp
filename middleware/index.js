const Mountain = require('../models/mountain');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'Please Login First'); // gives capability to see on next page
  res.redirect('/login');
};

middlewareObj.isMountainAuthor = function (req, res, next) {
  if(req.isAuthenticated()){
    Mountain.findById(req.params.id, (err, mountain) => {
      if(err) res.redirect('back');
      else {
        if (mountain.author.id.equals(req.user._id)){ // the former is an object and the latter a string so use .equal mongoose method
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {  
    res.redirect('back');
  }
}

middlewareObj.isCommentAuthor = function (req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, comment) => {
      if(err) {
        res.redirect('back');
      } else {
        if(comment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = middlewareObj