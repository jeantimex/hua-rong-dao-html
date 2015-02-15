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

  var MODE_USER_PLAY = 0,
      MODE_AI_LOADING = 1,
      MODE_AI_PLAY = 2;

  $scope.levelData = [];
  $scope.level = 0;
  $scope.totalLevel = 0;
  $scope.tiles = [];
  $scope.title = '';
  $scope.currentStep = 0;
  $scope.lastTile = null;

  $scope.aiSteps = [];
  $scope.aiTimeout = null;
  $scope.aiStepCount = 0;

  $scope.mode = MODE_USER_PLAY;

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
      $scope.stopAi();
      $scope.mode = MODE_USER_PLAY;

      $scope.level++;
      getCurrentLevelData();
    }
  };

  $scope.previousLevel = function () {
    if ($scope.level > 0) {
      $scope.stopAi();
      $scope.mode = MODE_USER_PLAY;

      $scope.level--;
      getCurrentLevelData();
    }
  };

  $scope.resetLevel = function () {
    $scope.stopAi();
    $scope.mode = MODE_USER_PLAY;
    $scope.currentStep = 0;
    getCurrentLevelData();
  };

  $scope.playAi = function () {
    if ($scope.mode != MODE_USER_PLAY) {
      return;
    }

    $scope.mode = MODE_AI_LOADING;

    TileService.solve($scope.tiles)
      .then(function (data) {
        if (angular.isArray(data)) {
          $scope.mode = MODE_AI_PLAY;
          $scope.aiSteps = data;
          $scope.aiStepCount = 0;
          $scope.aiTimeout = $timeout($scope.onAiMove, 1000);
        } else {
          $scope.mode = MODE_USER_PLAY;
        }
      }, function (err) {
        $log.error(err);
      });
  };

  $scope.onAiMove = function () {
    if ($scope.mode === MODE_USER_PLAY) {
      return;
    }

    var step = $scope.aiSteps[$scope.aiStepCount];
    var tile = $scope.tiles[step.id];

    if ($scope.lastTile != tile) {
      TileService.reset();
      $scope.currentStep++;
    }
    $scope.lastTile = tile;

    TileService.markTile(tile, 0);
    tile.pos += step.pos;
    TileService.markTile(tile, tile.type);

    if ($scope.aiStepCount < $scope.aiSteps.length - 1) {
      $scope.aiStepCount++;
      $scope.aiTimeout = $timeout($scope.onAiMove, 1000);
    } else {
      $scope.mode = MODE_USER_PLAY;
    }
  };

  $scope.stopAi = function() {
    $timeout.cancel($scope.aiTimeout);
    $scope.mode = MODE_USER_PLAY;
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
    if ($scope.mode === MODE_USER_PLAY) {
      if ($scope.lastTile != tile) {
        TileService.reset();
        $scope.currentStep++;
      }
      $scope.lastTile = tile;

      TileService.moveTile(tile);
    }
  };

  $scope.$on('levelComplete', function(event) {

  });

});
