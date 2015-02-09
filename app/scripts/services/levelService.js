'use strict';

/**
 *
 */

angular.module('GameApp')
.service('LevelService', function ($http, $q) {

  var dataUrl = 'data/levels.json';

  /**
   *
   */
  this.getLevelData = function () {
    var deferred = $q.defer();

    $http.get(dataUrl)
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function () {
        deferred.reject('There was an error');
      });

    return deferred.promise;
  };

});