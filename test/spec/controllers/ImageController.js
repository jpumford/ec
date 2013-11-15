'use strict';

describe('Controller: ImagecontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('ecApp'));

  var ImagecontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImagecontrollerCtrl = $controller('ImagecontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
