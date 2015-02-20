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
            LevelService, TileService) {

  // Define view states
  var VIEW_GAME = 0,
      VIEW_LEVELS = 1;

  // Define game modes
  var MODE_USER_PLAY = 0,
      MODE_AI_PLAY = 1;

  // Define game logic variables
  var lastTile = null;
  var currentLevel = null;
  var currentView = VIEW_LEVELS;
  var currentMode = MODE_USER_PLAY;

  // AI related
  var aiTimeout = null;
  var aiSteps = [];
  var aiStepCount = 0;

  var LEVEL_VIEW_TITLE = 'Select a level';

  // UI related
  $scope.title = '';
  $scope.tiles = [];
  $scope.levelGrid = [];
  $scope.currentStep = 0;
  $scope.levelPassed = false;

  // ------------------------------
  //  UI: Get title
  // ------------------------------

  $scope.getTitle = function () {
    if (currentView === VIEW_GAME) {
      return $scope.title;
    } else {
      return LEVEL_VIEW_TITLE;
    }
  };

  // ------------------------------
  //  UI: ng-show/ng-hide
  // ------------------------------

  $scope.isGameView = function () {
    return currentView === VIEW_GAME;
  };

  $scope.isLevelsView = function () {
    return currentView === VIEW_LEVELS;
  };

  $scope.isUserMode = function () {
    return currentMode === MODE_USER_PLAY;
  };

  $scope.isAiMode = function () {
    return currentMode === MODE_AI_PLAY;
  };

  // ------------------------------
  //  UI: ng-click handlers
  // ------------------------------

  var setLevelData = function (level) {
    var data = angular.copy(level);

    $scope.title = data.title;
    $scope.tiles = data.tiles;

    TileService.init(data.tiles);
  };

  $scope.back = function () {
    $scope.reset();
    currentView = VIEW_LEVELS;
  };

  $scope.selectLevel = function (level) {
    currentView = VIEW_GAME;
    currentLevel = angular.copy(level);

    $scope.reset();
  };

  $scope.reset = function () {
    $scope.stopAi();
    $scope.currentStep = 0;
    $scope.levelPassed = false;
    setLevelData(currentLevel);
  };

  $scope.moveTile = function (tile) {
    if (currentMode === MODE_USER_PLAY) {
      countStep(tile);
      TileService.moveTile(tile);
    }
  };

  // ------------------------------
  //  AI logic
  // ------------------------------

  $scope.playAi = function () {
    if (currentMode !== MODE_USER_PLAY) {
      return;
    }
    currentMode = MODE_AI_PLAY;

    TileService.solve($scope.tiles)
      .then(function (data) {
        if (angular.isArray(data) && data.length > 0 && currentMode === MODE_AI_PLAY) {
          aiSteps = data;
          aiStepCount = 0;
          aiTimeout = $timeout(onAiMove, 1000);
        } else {
          currentMode = MODE_USER_PLAY;
        }
      }, function () {
        currentMode = MODE_USER_PLAY;
      });
  };

  var onAiMove = function () {
    if (currentMode === MODE_USER_PLAY) {
      return;
    }

    var step = aiSteps[aiStepCount];
    var tile = $scope.tiles[step.id];
    var delay = 1000;

    countStep(tile);
    TileService.moveTileByPos(tile, step.pos);

    if (aiStepCount < aiSteps.length - 1) {
      aiStepCount++;
      aiTimeout = $timeout(onAiMove, delay);
    } else {
      currentMode = MODE_USER_PLAY;
    }
  };

  $scope.stopAi = function() {
    $timeout.cancel(aiTimeout);
    currentMode = MODE_USER_PLAY;
  };

  var countStep = function (tile) {
    if (lastTile !== tile) {
      TileService.reset();
      $scope.currentStep++;
    }
    lastTile = tile;
  };

  $scope.$on('levelComplete', function() {
    $scope.levelPassed = true;
  });

  // ------------------------------
  //  Level service
  // ------------------------------

  LevelService.getLevelData()
    .then(function (data) {
      $scope.levelGrid = data;
    }, function (err) {
      $log.error(err);
    });

});
