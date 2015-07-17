'use strict';

app.factory('Auth', function (User, $http, $state) {
	// var currentUser = null;
	return {
		isAdmin: null,
		currentUser: null,
		signup: function (credentials) {
			return new User(credentials).save();
		},
		login: function (credentials) {
			console.log(this)
			var self = this;
			return $http.post('/auth/login', credentials)
			.then(function (response) {
				self.currentUser = response.data._id
				self.isAdmin = response.data.isAdmin
				return response.data;
			});
		},
		logout: function () {
			var self = this;
			$http.get('/auth/logout').then(function () {
				$state.go('home');
				self.currentUser = null;
				self.isAdmin = false;
				console.log('logged out', self.currentUser)
			});

		},
		goMe: function(){
			var self = this;
			return $http.get('/api/users/me').then(function(res){
				console.log(res)
				self.currentUser = res.data._id
				self.isAdmin = res.data.isAdmin
				return res.data
			})
		}
	}
});