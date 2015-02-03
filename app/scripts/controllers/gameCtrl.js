'use strict';

/**
 * @ngdoc function
 * @name klotskiApp.controller:MainCtrl
 * @description
 * # GameCtrl
 * Controller of the klotskiApp
 */
angular.module('gameApp')
.controller('GameCtrl', function (GameManager) {
  this.gameMgr = GameManager;
});
