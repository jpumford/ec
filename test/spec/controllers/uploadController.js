'use strict';

describe('Controller: UploadcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('ecApp'));

  var UploadcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadcontrollerCtrl = $controller('UploadcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
