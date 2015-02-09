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
      // Property map
      var map = {
        9: [160, 160, ['#E63A4F']],
        1: [80,  80,  ['#EE7DA0', '#A097BD', '#F98D25', '#76C2BE']],
        2: [160, 80,  ['#46B6CA', '#FDB42D']],
        3: [80,  160, ['#C794AF', '#2CC283', '#99AB43', '#FDB42D']]
      };
      
      var tile   = scope[attrs.tile],
          type   = parseInt(tile.type),
          index  = parseInt(tile.index),
          width  = map[type][0],
          height = map[type][1],
          color  = map[type][2][index];

      element.addClass('tile');

      // Width and height
      element.css('width', width);
      element.css('height', height);

      // X & Y
      scope.$watch(attrs.tile, function (tile) {
        var row = parseInt(tile.pos / 4),
            col = parseInt(tile.pos % 4);

        // Position
        element.css('top', row * 80 + 'px');
        element.css('left', col * 80 + 'px');
      }, true);

      // Color
      element.css('backgroundColor', color);
    }
  };
});