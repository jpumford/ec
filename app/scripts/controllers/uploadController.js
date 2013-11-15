'use strict';

angular.module('ecApp')
	.controller('UploadController', function ($scope, $upload, imageService) {
		$scope.showModal = function() {
			if ($scope.modal) {
				$scope.modal.show();
			} else {
				$scope.modal = new CUI.Modal({
					element: '#imageUploadModal'
				});
			}
		};

		$scope.name = "";

		$scope.errors = [];

		$scope.percentUploaded = 0;
		$scope.uploading = false;

		$scope.submitFile = function() {
			$scope.errors = [];
			// is the name valid?
			if ($scope.name == "") {
				$scope.errors.push("Please enter a name");
			}
			// is the file available?
			if (!$scope.file) {
				$scope.errors.push("Please select an image to upload");
			}

			if ($scope.errors.length > 0) {
				return;
			}

			$scope.percentUploaded = 0;
			$scope.uploading = true;

			$upload.upload({
				url: 'upload',
				method: 'POST',
				data: {myObj: $scope.myModelObj, name: $scope.name},
				file: $scope.file,
				progress: function(evt) {
					$scope.percentUploaded = parseInt(100.0 * evt.loaded / evt.total);
				}
			}).success(function(data, status, headers, config) {
				$scope.modal.hide();
				$scope.name = "";
				$scope.file = undefined;
				imageService.images.push(data.data);
			}).error(function(err) {
				$scope.errors.push("Error uploading file");
				console.log(err);
			}).then(function() {
				$scope.uploading = false;
				$scope.percentUploaded = 0;
			});
		};

		$scope.onFileSelect = function($files) {
			$scope.file = $files[0];
		};
	});
