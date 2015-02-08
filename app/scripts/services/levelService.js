'use strict';

/**
 *
 */

angular.module('gameApp')
.service('LevelService', function ($http, $q) {

  var dataUrl = 'data/levels.json';

  /**
   *
   */
  this.getTotalLevel = function () {
    var deferred = $q.defer();

    $http.get(dataUrl)
      .success(function (data) {
        deferred.resolve(data.length);
      })
      .error(function () {
        deferred.reject('There was an error');
      });

    return deferred.promise;
  };

  /**
   *
   */
  this.getLevelData = function (level) {
    var deferred = $q.defer();

    $http.get(dataUrl)
      .success(function (data) {
        deferred.resolve(data[level]);
      })
      .error(function () {
        deferred.reject('There was an error');
      });

    return deferred.promise;
  };

});