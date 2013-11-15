'use strict';

angular.module('ecApp')
	.controller('ImageController', function ($scope, $http, roomService, imageService) {
		$scope.pictures = imageService.images
		$scope.$watch(function() { return imageService.images; }, function() {
			$scope.pictures = imageService.images;
		});

		$http({
			method: 'GET',
			url: '/images'
		}).success(function(data, status, headers, config) {
			if (data.status == 'ok') {
				imageService.images = data.data.pictures;
			}
		});

		$scope.imageClicked = function(id, description) {
			roomService.id = id;
			roomService.description = description;
		};

	});
