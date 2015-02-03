'use strict';

/**
 * @ngdoc function
 * @name klotskiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the klotskiApp
 */
angular.module('klotskiApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
