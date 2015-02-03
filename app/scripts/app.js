'use strict';

/**
 * @ngdoc overview
 * @name klotskiApp
 * @description
 * # gameApp
 *
 * Main module of the application.
 */
angular
  .module('gameApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'gameManager'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/game', {
        templateUrl: 'views/game.html'
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
      return loc === $location.path();
    };
  });
