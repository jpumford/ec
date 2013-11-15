'use strict';

describe('Filter: chatMessage', function () {

  // load the filter's module
  beforeEach(module('ecApp'));

  // initialize a new instance of the filter before each test
  var chatMessage;
  beforeEach(inject(function ($filter) {
    chatMessage = $filter('chatMessage');
  }));

  it('should return the input prefixed with "chatMessage filter:"', function () {
    var text = 'angularjs';
    expect(chatMessage(text)).toBe('chatMessage filter: ' + text);
  });

});
