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

    var self = this;

    $http.get(dataUrl)
      .success(function (data) {
        self.processData(data);
        deferred.resolve(data);
      })
      .error(function () {
        deferred.reject('There was an error');
      });

    return deferred.promise;
  };

  /**
   *
   */
  this.processData = function (data) {
    if (angular.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        var tiles = data[i].tiles;

        if (angular.isArray(tiles)) {
          for (var j = 0; j < tiles.length; j++) {
            tiles[j].id = j;
          }
        }
      }
    }
  };

});
