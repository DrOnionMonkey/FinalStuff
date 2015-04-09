var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//User
router.get('/users', function(req, res, next) {
  User.find(function(err, users){
    if(err){ return next(err); }
    res.json(users);
  });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }
    res.json(posts);
  });
});

router.post('/users', function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err, user){
    if(err){ return next(err); }
    res.json(user);
  });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  post.save(function(err, post){
  if(err){ return next(err); }
    res.json(post);
  });
});

router.param('user', function(req, res, next, id) {
  var query = User.findById(id);
  query. exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error("can't find user")); }
    req.user = user;
    return next();
  });
});i

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);
  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }
    req.post = post;
    return next();
  });
});

//return a user
router.get('/users/:user', function(req, res, next) {
  res.json(req.user);
});

// return a post
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});

router.put('/users/:user/upmatch', function(req, res, next) {
  req.user.upmatch(function(err, user){
    if (err) { return next(err); }
    res.json(user);
  });
});

router.put('/users/:user/upwins', function(req, res, next) {
  req.user.upwins(function(err, user){
    if (err) { return next(err); }
    res.json(user);
  });
});

router.put('/users/:user/uplosses', function(req, res, next) {
  req.user.uplosses(function(err, user){
    if (err) { return next(err); }
    res.json(user);
  });
});

router.put('/users/:user/moneymanip/:amount', function(req, res, next) {
  req.user.moneymanip(req.amount,function(err, user){
    if (err) { return next(err); }
    res.json(user);
  });
});


router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
});

// Preload comment objects on routes with ':comment
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

// create a new comment
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

// upvote a comment
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	console.log("in router.put comment upvote:");
	console.log(req.comment);
  req.comment.upvote(function(err, comment){
    
	console.log("in upvote Rout");	

     if (err) { 
	console.log("Error");
	console.log(err);
	return next(err); }

    res.json(comment);
  });
});

module.exports = router;
