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
  function ($scope, $location, $route, $routeParams, $timeout, $log,
            LevelService, KeyboardService, TileService) {

  $scope.levelData = [];
  $scope.level = 0;
  $scope.totalLevel = 0;
  $scope.tiles = [];
  $scope.title = '';

  $scope.aiSteps = [];
  $scope.aiTimeout = null;
  $scope.aiStepCount = 0;

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
    if ($scope.level < $scope.totalLevel - 1) {
      $scope.level++;
      getCurrentLevelData();
    }
  };

  $scope.previousLevel = function () {
    if ($scope.level > 0) {
      $scope.level--;
      getCurrentLevelData();
    }
  };

  $scope.resetLevel = function () {
    getCurrentLevelData();
  };

  $scope.help = function () {
    TileService.solve($scope.tiles)
      .then(function (data) {
        $scope.aiSteps = data;
        $scope.aiStepCount = 0;
        $scope.aiTimeout = $timeout($scope.onAiMove ,1000);
      }, function (err) {
        $log.error(err);
      });
  };

  $scope.onAiMove = function () {
    var step = $scope.aiSteps[$scope.aiStepCount];

    $scope.tiles[step.id].pos += step.pos;

    if ($scope.aiStepCount < $scope.aiSteps.length - 1) {
      $scope.aiStepCount++;
      $scope.aiTimeout = $timeout($scope.onAiMove, 1000);
    }
  };

  $scope.stopAi = function(){
    $timeout.cancel($scope.aiTimeout);
  }

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
    var data = angular.copy($scope.levelData[$scope.level]);

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

  $scope.$on('levelComplete', function(event) {

  });

});
