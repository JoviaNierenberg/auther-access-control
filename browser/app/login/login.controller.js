'use strict';

app.controller('LoginCtrl', function ($scope, Auth, $state) {
	$scope.loginUser = function (userData) {
		Auth.login(userData)
		
		.then(function (loggedinUser) {
			$state.go('user', {id: loggedinUser._id});
			console.log('logged in user in then' ,Auth.currentUser)
		})
		.catch(function (e) {
			console.log('error logging in', e);
		});
	};
});