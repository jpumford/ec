'use strict';

angular.module('ecApp')
	.controller('MainCtrl', function ($scope, socket, roomService) {
		$scope.messages = [];
		$scope.room = {
			id: roomService.id,
			description: roomService.description
		};

		$scope.$watch(function() { return roomService.id; }, function() {
			changeRoom(roomService.description, roomService.id);
		}, true);

		socket.on('init', function(data) {
			$scope.name = data.name;
			$scope.users = data.users;
			changeRoom(data.room, data.room);
		});

		socket.on('send:message', function(message) {
			$scope.messages.push(message);
		});

		socket.on('change:name', function(data) {
			changeName(data.oldName, data.newName);
		});

		socket.on('user:join', function(data) {
			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + data.name + ' has joined.'
			});
			$scope.users.push(data.name);
		});

		socket.on('user:left', function(data) {
			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + data.name + ' has left.'
			});
			var index = $scope.users.indexOf(data.name);
			if (index != -1) {
				$scope.users.splice(index, 1);
			}
		});

		socket.on('users', function(data) {
			$scope.users = data.users;
		});

		function changeName(oldName, newName) {
			var index = $scope.users.indexOf(oldName);
			if (index != -1) {
				$scope.users[index] = newName;
				$scope.messages.push({
					user: 'chatroom',
					text: 'User "' + oldName + '" has changed their name to "' + newName + '"'
				});
			}
		}

		$scope.changeName = function() {
			socket.emit('change:name', {
				name: $scope.newName
			}, function(result) {
				if (!result) {
					alert("There was an error changing your name");
				} else {
					changeName($scope.name, $scope.newName);

					$scope.name = $scope.newName;
					$scope.newName = '';
				}
			});
		};

		$scope.sendMessage = function() {
			socket.emit('send:message', {
				message: $scope.message
			});

			$scope.messages.push({
				user: $scope.name,
				text: $scope.message
			});

			$scope.message = '';
		};

		function changeRoom(newRoomDescription, newRoomId) {
			console.log(newRoomDescription, newRoomId);
			console.log($scope.room);
			if (newRoomId !== $scope.room.id) {
				socket.emit('change:room', {
					room: newRoomId
				});
				$scope.room.description = newRoomDescription;
				$scope.room.id = newRoomId;
				$scope.messages.push({
					user: 'chatroom',
					text: 'Now speaking in room "' + $scope.room.description + '"'
				});
			}
		}

	});
