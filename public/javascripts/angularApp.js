angular.module('weatherNews', ['ui.router'])
.factory('postFactory', ['$http', function($http){
  var o = {
    posts: [],
    post: {}
  };

  var u = {
    users: [],
    user: {}
  });

  o.getAll = function() {
	return $http.get('/posts').success(function(data){
		angular.copy(data, o.posts);
	});
  };
  u.getAll = function() [
	return $http.get('/users').success(function(data){
		angular.copy(data, u.users);
	});
  };

  o.create = function(post) {
	return $http.post('/posts', post).success(function(data){
		o.posts.push(data);
	});
  };
  u.create = function(user) {
	return $http.post('/users', user).success(function(data){
		u.users.push(data);
	});
  };

  o.upvote = function(post) {
	return $http.put('/posts/' + post._id + '/upvote')
		.success(function(data){
			post.upvotes += 1;
      		});
  };
  u.upmatch = function(user) {
	return $http.put('/users/' + user._id + '/upmatch')
	  	.success(function(data){
	    		user.matches += 1;
	  	});
  };
  u.upwins = function(user) {
        return $http.put('/users/' + user._id + '/upwins')
                .success(function(data){
                        user.wins += 1;
                });
  };
  u.uplosses = function(user) {
        return $http.put('/users/' + user._id + '/uplosses')
                .success(function(data){
                        user.losses += 1;
                });
  };
  u.moneymanip = function(amount, user) {
        return $http.put('/users/' + user._id + '/upmatch'+ amount)
                .success(function(data){
                        user.matches += amount;
                });
  };

  o.getPost = function(id) {
    	return $http.get('/posts/' + id).success(function(data){
      		angular.copy(data, o.post);
    	});
  };
  u.getUser = function(id) {
	return $http.get('/users/' + id).success(function(data){
		angular.copy(data, u.user);
	});
  };

  o.addNewComment = function(id, comment) {
    	return $http.post('/posts/' + id + '/comments', comment);
  };
  o.upvoteComment = function(selPost, comment) {
	console.log("upvote comment function in the app.js factory");
	console.log("post id: " +selPost._id+"   Comment id: " +comment._id);
    	return $http.put('/posts/' + selPost._id + '/comments/'+ comment._id + '/upvote')
      		.success(function(data){
        	comment.upvotes += 1;
      	});
  };

var out = {
	u: u,
	p: o
}
  return out;
}])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'login.html',
			controller: 'LoginCtrl'
		});
    $urlRouterProvider.otherwise('home');
}])
.controller('MainCtrl', [
  '$scope',
  'postFactory',
  function($scope, postFactory){
    postFactory.o.getAll();
    $scope.posts = postFactory.o.posts;
	$scope.addPost = function() {
	if($scope.formContent === '') { return; }
	postFactory.o.create({
	title: $scope.formContent,
	});
      $scope.formContent='';
    };
	$scope.incrementUpvotes = function(post) {
		postFactory.o.upvote(post);
	};
  }
])
.controller('PostCtrl', [
  '$scope',
  '$stateParams',
  'postFactory', 
  function($scope, $stateParams, postFactory){
	var mypost = postFactory.o.posts[$stateParams.id];
 	postFactory.o.getPost(mypost._id);
  	$scope.post = postFactory.o.post;    


//$scope.post = postFactory.posts[$stateParams.id];

    $scope.addComment = function(){
      if($scope.body === '') { return; }
      postFactory.o.addNewComment(postFactory.post._id, {
        body:$scope.body
      }).success(function(comment) {
        mypost.comments.push(comment); // Update the version in the array
        postFactory.o.post.comments.push(comment);// Update the version in the view
      });
      $scope.body = '';
    };
  $scope.incrementUpvotes = function(comment){
	console.log("incrementUp "+postFactory.post._id+" comment "+comment._id);
	postFactory.o.upvoteComment(postFactory.post, comment); 
  };
}])
.controller('LoginCtrl' , [
  '$scope', 
  '$stateParams', 
  'postFactory', 
  function($scope, $stateParams, postFactory){
	postFactory.u.getAll();
	$scope.users = postFactory.u.users;
	$scope.addUser = function() {
		if($scope.username === '' || $scope.password === '') { return; }
		postFactory.u.create({
		username: $scope.username,
		password; $scope.password,
		});
		$scope.formContent='';
	};
  };
]);
