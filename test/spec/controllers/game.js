/**
 * Created by su on 3/2/15.
 */

'use strict';

describe('Controller: GameCtrl', function () {

  // load the controller's module
  beforeEach(module('GameApp'));

  var GameCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    scope = $rootScope.$new();

    GameCtrl = $controller('GameCtrl', {
      $scope: scope
    });

  }));

  it('should have a working TileService service', inject(['TileService',

    function(TileService) {

    }

  ]));

});
