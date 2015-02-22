'use strict';

/**
 *
 */

angular
.module('GameApp')
.directive('tile', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var tile   = scope[attrs.tile],
          type   = parseInt(tile.type),
          index  = parseInt(tile.index),
          isThumbnail = !angular.isUndefined(element.attr('thumbnail'));

      element.addClass(isThumbnail ? 'tile thumbnail' : 'tile');
      element.addClass('t' + type);
      element.addClass('s' + index);

      // X & Y
      scope.$watch(attrs.tile, function (tile) {
        var row = parseInt(tile.pos / 4),
            col = parseInt(tile.pos % 4);

        // Position
        var base = isThumbnail ? 20 : 80;
        element.css('top', row * base + 'px');
        element.css('left', col * base + 'px');
      }, true);
    }
  };
});
