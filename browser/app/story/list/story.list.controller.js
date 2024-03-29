'use strict';

app.controller('StoryListCtrl', function ($scope, stories, Story, users, Auth) {
	$scope.stories = stories;
	$scope.users = users;

	$scope.newStory = new Story();
	$scope.currentUser = (!!Auth.currentUser);
	
	$scope.removeStory = function (story) {
		console.log(story);
		story.destroy()
		.then(function () {
			var idx = $scope.stories.indexOf(story);
			$scope.stories.splice(idx, 1);
		});
	};

	$scope.addStory = function () {
		$scope.newStory.save()
		.then(function (created) {
			$scope.newStory = new Story();
			$scope.stories.unshift(created);
		});
	};
});