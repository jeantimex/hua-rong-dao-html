'use strict';

/**
 *
 */

angular.module('GameApp')
.service('TileService', function () {

  this.grid = [];
  this.path = [];
  this.stack = [];
  this.visited = {};
  this.lastTile = null;

  /**
   * Initialize the grid
   */
  this.init = function (tiles) {
    var i, j = 0;

    this.grid = [];

    this.lastTile = null;

    this.reset();

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

  this.reset = function () {
    this.path = [];
    this.stack = [];
    this.visited = {};

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
    if (tile !== this.lastTile) {
      this.reset();
    }
    this.lastTile = tile;

    var i;

    // step 1. Check all directions and find out the possible positions
    var positions = this.getUnvisitedPositions(tile);
    //console.log('----------------------');
    //console.log('positions: ' + positions);

    if (!this.visited.hasOwnProperty(tile.pos)) {
      for (i = 0; i < positions.length; i++) {
        if (this.stack.indexOf(positions[i]) === -1) {
          this.stack.push(positions[i]);
        }
      }

      // mark current pos as visited
      this.visited[tile.pos] = true;
    }

    //console.log('visited: ' + this.visited);
    //console.log('stack: ' + this.stack);

    if (this.stack.length > 0) {
      var index = -1;

      for (i = positions.length - 1; i >= 0; i--) {
        index = this.stack.indexOf(positions[i]);
        if (index >= 0) {
          break;
        }
      }

      this.cleanTile(tile);

      if (index >= 0) {
        this.path.push(tile.pos);
        tile.pos = this.stack[index];
        this.stack.splice(index, 1);
      } else {
        tile.pos = this.path.pop();
      }

      this.markTile(tile);
    }

    //console.log('path: ' + this.path);
    //console.log('stack: ' + this.stack);

    positions = this.getUnvisitedPositions(tile);
    //console.log('positions: ' + positions);

    if (positions.length === 0 && this.stack.length === 0) {
      this.reset();
    }
  };

  this.calPos = function (row, col) {
    return row * 4 + col;
  };

  /**
   * Get movable positions in up, down, left and right directions
   * @param tile
   * @returns {Array}
   */
  this.getUnvisitedPositions = function (tile) {
    var res = [];

    var pos = tile.pos,
        row = parseInt(pos / 4),
        col = parseInt(pos % 4);

    // up
    if (row > 0 && this.grid[row - 1][col] === 0) {
      res.push(this.calPos(row - 1, col));
    }

    // right
    if (col < 3 && this.grid[row][col + 1] === 0) {
      res.push(this.calPos(row, col + 1));
    }

    // left
    if (col > 0 && this.grid[row][col - 1] === 0) {
      res.push(this.calPos(row, col - 1));
    }

    // down
    if (row < 4 && this.grid[row + 1][col] === 0) {
      res.push(this.calPos(row + 1, col));
    }

    for (var i = res.length - 1; i >= 0; i--) {
      if (this.visited.hasOwnProperty(res[i])) {
        res.splice(i, 1);
      }
    }

    return res;
  };

  this.cleanTile = function (tile) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    this.grid[row][col] = 0;
  };

  this.markTile = function (tile) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    this.grid[row][col] = tile.type;
  };

});
