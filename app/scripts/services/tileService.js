'use strict';

/**
 *
 */

angular.module('GameApp')
.service('TileService', function ($rootScope, $q) {

  var ROW = 5;
  var COL = 4;

  this.grid = [];
  this.path = [];
  this.stack = [];
  this.visited = {};

  /**
   * Initialize the grid
   */
  this.init = function (tiles) {
    this.grid = this.getGrid(tiles);
    this.reset();
    this.aiMode = false;
  };

  /**
   *
   * @param tiles
   * @returns {Array}
   */
  this.getGrid = function (tiles) {
    var res = [];
    var i, j = 0;

    for (i = 0; i < ROW; i++) {
      res[i] = [];
      for (j = 0; j < COL; j++) {
        res[i][j] = 0;
      }
    }

    for (i = 0; i < tiles.length; i++) {
      var tile = tiles[i],
          type = parseInt(tile.type),
          row  = parseInt(tile.pos / 4),
          col  = parseInt(tile.pos % 4);

      res[row][col] = type;

      switch (tile.type) {
        case 9:
          res[row][col + 1] = type;
          res[row + 1][col] = type;
          res[row + 1][col + 1] = type;
          break;

        case 2:
          res[row][col + 1] = type;
          break;

        case 3:
          res[row + 1][col] = type;
          break;
      }
    }

    return res;
  };

  /**
   *
   */
  this.reset = function () {
    this.path = [];
    this.stack = [];
    this.visited = {};
  };

  /**
   *
   */
  this.printGrid = function (grid) {
    for (var i = 0; i < ROW; i++) {
      console.log(grid[i]);
    }
  };

  /**
   * Move tile
   */
  this.moveTile = function (tile) {
    var i;

    // step 1. Get all unvisited positions around the tile
    var positions = this.getUnvisitedPositions(tile);

    if (!this.visited.hasOwnProperty(tile.pos)) {
      for (i = 0; i < positions.length; i++) {
        if (this.stack.indexOf(positions[i]) === -1) {
          this.stack.push(positions[i]);
        }
      }

      // mark current pos as visited
      this.visited[tile.pos] = true;
    }

    if (this.stack.length > 0) {
      var index = -1;

      // if current available positions are in the stack
      // then we will go to that position
      for (i = positions.length - 1; i >= 0; i--) {
        index = this.stack.indexOf(positions[i]);
        if (index >= 0) {
          break;
        }
      }

      // finally we move the position
      // move out current position
      this.markTile(tile, 0);

      if (index >= 0) {
        // add current tile to the path
        this.path.push(tile.pos);
        // move current tile to stack[index]
        tile.pos = this.stack[index];
        this.stack.splice(index, 1);
      } else {
        // trace back
        tile.pos = this.path.pop();
      }

      // move in current position
      this.markTile(tile, tile.type);
    }

    if (tile.type === 9 && tile.pos === 13) {
      $rootScope.$broadcast('levelComplete');
    }

    positions = this.getUnvisitedPositions(tile);

    if (positions.length === 0 && this.stack.length === 0) {
      this.reset();
    }
  };

  /**
   *
   * @param row
   * @param col
   * @returns {*}
   */
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

    switch (tile.type) {
      // type 1
      case 1:
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

        break;

      // type 2
      case 2:
        // up
        if (row > 0 && this.grid[row - 1][col] === 0 && this.grid[row - 1][col + 1] === 0) {
          res.push(this.calPos(row - 1, col));
        }

        // right
        if (col < 2 && this.grid[row][col + 2] === 0) {
          res.push(this.calPos(row, col + 1));
        }

        // left
        if (col > 0 && this.grid[row][col - 1] === 0) {
          res.push(this.calPos(row, col - 1));
        }

        // down
        if (row < 4 && this.grid[row + 1][col] === 0 && this.grid[row + 1][col + 1] === 0) {
          res.push(this.calPos(row + 1, col));
        }

        break;

      // type 3
      case 3:
        // up
        if (row > 0 && this.grid[row - 1][col] === 0) {
          res.push(this.calPos(row - 1, col));
        }

        // right
        if (col < 3 && this.grid[row][col + 1] === 0 && this.grid[row + 1][col + 1] === 0) {
          res.push(this.calPos(row, col + 1));
        }

        // left
        if (col > 0 && this.grid[row][col - 1] === 0 && this.grid[row + 1][col - 1] === 0) {
          res.push(this.calPos(row, col - 1));
        }

        // down
        if (row < 3 && this.grid[row + 2][col] === 0) {
          res.push(this.calPos(row + 1, col));
        }

        break;

      // type 9
      case 9:
        // up
        if (row > 0 && this.grid[row - 1][col] === 0 && this.grid[row - 1][col + 1] === 0) {
          res.push(this.calPos(row - 1, col));
        }

        // right
        if (col < 2 && this.grid[row][col + 2] === 0 && this.grid[row + 1][col + 2] === 0) {
          res.push(this.calPos(row, col + 1));
        }

        // left
        if (col > 0 && this.grid[row][col - 1] === 0 && this.grid[row + 1][col - 1] === 0) {
          res.push(this.calPos(row, col - 1));
        }

        // down
        if (row < 3 && this.grid[row + 2][col] === 0 && this.grid[row + 2][col + 1] === 0) {
          res.push(this.calPos(row + 1, col));
        }

        break;
    }

    // remove visited position(s)
    for (var i = res.length - 1; i >= 0; i--) {
      if (this.visited.hasOwnProperty(res[i])) {
        res.splice(i, 1);
      }
    }

    return res;
  };

  /**
   *
   * @param tile
   * @param type
   */
  this.markTile = function (tile, type) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    switch (tile.type) {
      case 1:
        this.grid[row][col] = type;
        break;

      case 2:
        this.grid[row][col] = type;
        this.grid[row][col + 1] = type;
        break;

      case 3:
        this.grid[row][col] = type;
        this.grid[row + 1][col] = type;
        break;

      case 9:
        this.grid[row][col] = type;
        this.grid[row][col + 1] = type;
        this.grid[row + 1][col] = type;
        this.grid[row + 1][col + 1] = type;
        break;
    }
  };

  // --------------------------------------
  //  Solve Puzzle Algorithm
  // --------------------------------------

  /**
   *
   * @param tiles
   */
  this.solve = function (tiles) {
    var worker = new Worker('scripts/workers/tileWorker.js');
    var defer = $q.defer();

    worker.addEventListener('message', function (e) {
      defer.resolve(e.data);
    }, false);

    worker.postMessage(tiles);

    return defer.promise;
  };

});
