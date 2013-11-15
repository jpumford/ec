'use strict';

angular.module('ecApp')
  .filter('chatMessage', function () {
    return function (input) {
		if (input.user != 'chatroom') {
			return input.user + ' : ' + input.text;
		}
		return input.text;
    };
  });
