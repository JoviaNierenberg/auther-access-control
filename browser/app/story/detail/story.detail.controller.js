'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, Auth) {
	$scope.story = story;
	var toSave = angular.copy($scope.story);
	$scope.selected = story.author;
	$scope.users = users;

	$scope.currentUser = (!!Auth.currentUser);
	$scope.updateParagraph = function (idx, text) {
		if (text) toSave.paragraphs[idx] = text;
		else {
			$scope.story.paragraphs.splice(idx, 1);
			toSave.paragraphs.splice(idx,1);
		}
		save();
	};
	$scope.addParagraph = function () {
		toSave.paragraphs.push('');
		$scope.story.paragraphs.push('');
	};
	$scope.updateAuthor = function () {
		toSave.author = $scope.selected;
		save();
	};
	$scope.updateTitle = function () {
		toSave.title = $scope.story.title;
		save();
	};
	function save () {
		toSave.save();
	}
});