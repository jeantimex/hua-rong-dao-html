'use strict';

/**
 * @ngdoc overview
 * @name klotskiApp
 * @description
 * # GameApp
 *
 * Main module of the application.
 */
angular
.module('GameApp', ['ngRoute', 'ngAnimate', 'Keyboard'])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .when('/game', {
      redirectTo: '/game/0'
    })
    .when('/game/:level', {
      templateUrl: 'views/game.html',
      controller: 'GameCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'ContactCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.controller('AppCtrl', function ($scope, $location) {
  $scope.isActive = function (loc) {
    var pattern = new RegExp(loc);
    return pattern.test($location.path());
  };
});
