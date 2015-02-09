'use strict';

/**
 *
 */

angular.module('GameApp')
.service('TileService', function () {

  this.grid = [];

  /**
   * Initialize the grid
   */
  this.init = function (tiles) {
    var i, j = 0;

    this.grid = [];
    
    for (i = 0; i < 5; i++) {
      this.grid[i] = [];
      for (j = 0; j < 4; j++) {
        this.grid[i][j] = 0;
      }
    }

    for (i = 0; i < tiles.length; i++) {
      var tile   = tiles[i],
          type   = parseInt(tile.type),
          row    = parseInt(tile.pos / 4),
          col    = parseInt(tile.pos % 4);

      this.grid[row][col] = type;

      switch (tile.type) {
        case 9:
          this.grid[row][col + 1] = type;
          this.grid[row + 1][col] = type;
          this.grid[row + 1][col + 1] = type;
          break;

        case 2:
          this.grid[row][col + 1] = type;
          break;

        case 3:
          this.grid[row + 1][col] = type;
          break;
      }
    }
  };

  this.printGrid = function () {
    for (var i = 0; i < 5; i++) {
      console.log(this.grid[i]);
    }
  };

  /**
   * Move tile
   */
  this.moveTile = function (tile) {
    tile.pos++;
  };

});