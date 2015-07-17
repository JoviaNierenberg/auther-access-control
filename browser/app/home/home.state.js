'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/',
		controller: function(Auth){
			console.log(Auth.goMe)
			Auth.goMe().then(function(data){
				console.log('goMe! ', data)
			});
		},
		templateUrl: '/browser/app/home/home.html'
	});
});