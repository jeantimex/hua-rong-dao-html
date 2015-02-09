'use strict';

/**
 * @ngdoc function
 * @name klotskiApp.controller:MainCtrl
 * @description
 * # GameCtrl
 * Controller of the klotskiApp
 */

angular.module('GameApp')
.controller('GameCtrl', function ($scope, $location, $route, $routeParams, $log, LevelService, KeyboardService) {

  $scope.level = ($routeParams.level || 0);
  $scope.totalLevel = 0;
  $scope.tiles = [];
  $scope.title = '';

  // ------------------------------
  //  Navigation
  // ------------------------------

  $scope.getNextClass = function () {
    return $scope.level < $scope.totalLevel - 1 ? '' : 'disabled';
  };

  $scope.getPreviousClass = function () {
    return $scope.level > 0 ? '' : 'disabled';
  };

  $scope.nextLevel = function () {
    $scope.level++;
    $scope.getCurrentLevelData();
  };

  $scope.previousLevel = function () {
    $scope.level--;
    $scope.getCurrentLevelData();
  };

  // ------------------------------
  //  Level service
  // ------------------------------

  LevelService.getTotalLevel()
    .then(function (data) {
      $scope.totalLevel = data;
    }, function (err) {
      $log.error(err);
    });

  $scope.getCurrentLevelData = function () {
    LevelService.getLevelData($scope.level)
      .then(function (data) {
        $scope.title = data.title;
        $scope.tiles = data.tiles;
      }, function (err) {
        $log.error(err);
      });
  };

  // ------------------------------
  //  Keyboard service
  // ------------------------------  

  KeyboardService.on(function (key) {
    console.log(key);
  });

  // ------------------------------
  //  Event handlers
  // ------------------------------  

  $scope.move = function (index) {
    console.log('move: ' + index);
  };

  // ------------------------------
  //  Initialize
  // ------------------------------

  $scope.getCurrentLevelData();

});
