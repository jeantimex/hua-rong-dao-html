'use strict';

/**
 *
 */

angular.module('GameApp')
.service('TileService', function ($rootScope) {

  var ROW = 5;
  var COL = 4;

  this.grid = [];
  this.path = [];
  this.stack = [];
  this.visited = {};
  this.lastTile = null;

  /**
   * Initialize the grid
   */
  this.init = function (tiles) {
    this.grid = this.getGrid(tiles);
    this.lastTile = null;
    this.reset();
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
    if (tile !== this.lastTile) {
      this.reset();
    }
    this.lastTile = tile;

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
    console.log("solve...");

    var visited = {};
    var queue = [];
    var level = 0;

    // Initial state
    var grid;
    var key = this.getKey(this.getGrid(tiles));
    visited[key] = true;

    queue.push({
      tiles: angular.copy(tiles),
      path: []
    });

    queue.push(null);

    // BFS
    while (queue.length > 0) {
      // dequeue
      var state = queue[0];
      queue.splice(0, 1);

      if (angular.isObject(state)) {
        grid = this.getGrid(state.tiles);

        // check if it's complete
        if (this.pass(state.tiles)) {
          console.log(state.path.length);
          console.log(state.path);
          this.printGrid(grid);
          return true;
        }

        // generate every possible state by each tile
        for (var i = 0; i < state.tiles.length; i++) {
          var tile = state.tiles[i];

          // up
          if (this.canMoveUp(tile, grid)) {
            tile.pos -= 4;
            state.path.push(tile.id + ' up');

            key = this.getKey(this.getGrid(state.tiles));

            if (!visited.hasOwnProperty(key)) {
              visited[key] = true;
              queue.push({
                tiles: angular.copy(state.tiles),
                path: angular.copy(state.path)
              });
            }

            tile.pos += 4;
            state.path.pop();
          }

          // down
          if (this.canMoveDown(tile, grid)) {
            tile.pos += 4;
            state.path.push(tile.id + ' down');

            key = this.getKey(this.getGrid(state.tiles));

            if (!visited.hasOwnProperty(key)) {
              visited[key] = true;
              queue.push({
                tiles: angular.copy(state.tiles),
                path: angular.copy(state.path)
              });
            }

            tile.pos -= 4;
            state.path.pop();
          }

          // left
          if (this.canMoveLeft(tile, grid)) {
            tile.pos -= 1;
            state.path.push(tile.id + ' left');

            key = this.getKey(this.getGrid(state.tiles));

            if (!visited.hasOwnProperty(key)) {
              visited[key] = true;
              queue.push({
                tiles: angular.copy(state.tiles),
                path: angular.copy(state.path)
              });
            }

            tile.pos += 1;
            state.path.pop();
          }

          // right
          if (this.canMoveRight(tile, grid)) {
            tile.pos += 1;
            state.path.push(tile.id + ' right');

            key = this.getKey(this.getGrid(state.tiles));

            if (!visited.hasOwnProperty(key)) {
              visited[key] = true;
              queue.push({
                tiles: angular.copy(state.tiles),
                path: angular.copy(state.path)
              });
            }

            tile.pos -= 1;
            state.path.pop();
          }
        }

      } else {
        if (queue.length > 0) {
          queue.push(null);
        }
      }
    }

    return false;
  };

  /**
   *
   * @param tile
   * @param grid
   */
  this.canMoveUp = function (tile, grid) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    switch (tile.type) {
      case 1:
        if (row === 0 || grid[row - 1][col] != 0) {
          return false;
        }
        break;

      case 2:
        if (row === 0 || grid[row - 1][col] != 0 || grid[row - 1][col + 1] != 0) {
          return false;
        }
        break;

      case 3:
        if (row === 0 || grid[row - 1][col] != 0) {
          return false;
        }
        break;

      case 9:
        if (row === 0 || grid[row - 1][col] != 0 || grid[row - 1][col + 1] != 0) {
          return false;
        }
        break;
    }

    return true;
  };

  /**
   *
   * @param grid
   * @param row
   * @param col
   */
  this.canMoveDown = function (tile, grid) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    switch (tile.type) {
      case 1:
        if (row === 4 || grid[row + 1][col] != 0) {
          return false;
        }
        break;

      case 2:
        if (row === 4 || grid[row + 1][col] != 0 || grid[row + 1][col + 1] != 0) {
          return false;
        }
        break;

      case 3:
        if (row === 3 || grid[row + 2][col] != 0) {
          return false;
        }
        break;

      case 9:
        if (row === 3 || grid[row + 2][col] != 0 || grid[row + 2][col + 1] != 0) {
          return false;
        }
        break;
    }

    return true;
  };

  /**
   *
   * @param grid
   * @param row
   * @param col
   */
  this.canMoveLeft = function (tile, grid) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    switch (tile.type) {
      case 1:
        if (col === 0 || grid[row][col - 1] != 0) {
          return false;
        }
        break;

      case 2:
        if (col === 0 || grid[row][col - 1] != 0) {
          return false;
        }
        break;

      case 3:
        if (col === 0 || grid[row][col - 1] != 0 || grid[row + 1][col - 1] != 0) {
          return false;
        }
        break;

      case 9:
        if (col === 0 || grid[row][col - 1] != 0 || grid[row + 1][col - 1] != 0) {
          return false;
        }
        break;
    }

    return true;
  };

  /**
   *
   * @param tile
   * @param grid
   * @returns {boolean}
   */
  this.canMoveRight = function (tile, grid) {
    var row = parseInt(tile.pos / 4),
        col = parseInt(tile.pos % 4);

    switch (tile.type) {
      case 1:
        if (col === 3 || grid[row][col + 1] != 0) {
          return false;
        }
        break;

      case 2:
        if (col === 2 || grid[row][col + 2] != 0) {
          return false;
        }
        break;

      case 3:
        if (col === 3 || grid[row][col + 1] != 0 || grid[row + 1][col + 1] != 0) {
          return false;
        }
        break;

      case 9:
        if (col === 2 || grid[row][col + 2] != 0 || grid[row + 1][col + 2] != 0) {
          return false;
        }
        break;
    }

    return true;
  }

  /**
   *
   * @param tiles
   */
  this.pass = function (tiles) {
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      if (tile.type === 9 && tile.pos === 13) {
        return true;
      }
    }
    return false;
  };

  /**
   *
   * @param grid
   */
  this.getKey = function (grid) {
    var i, j, k = -1, c = 0, key = 0;

    for (i = 0; i < ROW; i++) {
      for (j = 0; j < COL; j++) {
        var type = grid[i][j];
        var pos = i * COL + j;

        if (type === 9 && k === -1) {
          k = pos;
          key += pos * Math.pow(2, 32);
        } else if (type != 9) {
          key += type * Math.pow(2, (c++) * 2);
        }
      }
    }

    return key;
  };

});
