'use strict';

/**
 * @ngdoc function
 * @name klotskiApp.controller:MainCtrl
 * @description
 * # GameCtrl
 * Controller of the klotskiApp
 */

angular.module('GameApp')
.controller('GameCtrl', 
  function ($scope, $location, $route, $routeParams, $log, LevelService, KeyboardService, TileService) {

  $scope.levelData = [];
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
    getCurrentLevelData();
  };

  $scope.previousLevel = function () {
    $scope.level--;
    getCurrentLevelData();
  };

  // ------------------------------
  //  Level service
  // ------------------------------

  LevelService.getLevelData()
    .then(function (data) {
      $scope.levelData = data;
      $scope.totalLevel = data.length;

      getCurrentLevelData();
    }, function (err) {
      $log.error(err);
    });

  var getCurrentLevelData = function () {
    var data = $scope.levelData[$scope.level];
    
    $scope.title = data.title;
    $scope.tiles = data.tiles;

    TileService.init($scope.tiles);
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

  $scope.moveTile = function (tile) {
    TileService.moveTile(tile);
  };

});
