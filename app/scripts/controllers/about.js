'use strict';

/**
 * @ngdoc function
 * @name klotskiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the klotskiApp
 */
angular.module('klotskiApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
