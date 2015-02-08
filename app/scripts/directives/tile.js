'use strict';

/**
 *
 */

angular
.module('gameApp')
.directive('tile', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      element.addClass('tile');

      scope.$watch(attrs.x, function (x) {
        element.css('left', x + 'px');
      });
      scope.$watch(attrs.y, function (y) {
        element.css('top', y + 'px');
      });
      scope.$watch(attrs.width, function (width) {
        element.css('width', width + 'px');
      });
      scope.$watch(attrs.height, function (height) {
        element.css('height', height + 'px');
      });
      scope.$watch(attrs.color, function (color) {
        element.css('backgroundColor', color);
      });
    }
  };
});