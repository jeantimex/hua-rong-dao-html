/**
 * Created by su on 2/13/15.
 */

var ROW = 5;
var COL = 4;

self.isObject = function (val) {
  if (val === null) {
    return false;
  }

  return ((typeof val === 'function') || (typeof val === 'object'));
};

self.copy = function (obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    var out = [], i = 0, len = obj.length;

    for ( ; i < len; i++ ) {
      out[i] = arguments.callee(obj[i]);
    }

    return out;
  }

  if (typeof obj === 'object') {
    var out = {}, i;

    for ( i in obj ) {
      out[i] = arguments.callee(obj[i]);
    }

    return out;
  }

  return obj;
};

/**
 *
 * @param tile
 * @param grid
 */
self.canMoveUp = function (tile, grid) {
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
self.canMoveDown = function (tile, grid) {
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
self.canMoveLeft = function (tile, grid) {
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
self.canMoveRight = function (tile, grid) {
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
self.pass = function (tiles) {
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
 * @param tiles
 * @returns {Array}
 */
self.getGrid = function (tiles) {
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
 * @param grid
 */
self.getKey = function (tiles) {
  var grid = this.getGrid(tiles);
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

self.addPath = function (path, id, pos) {
  var res = self.copy(path);
  if (res.length > 0 && res[res.length - 1].id === id && res[res.length - 1].pos === pos) {
    res[res.length - 1].pos += pos;
  } else {
    res.push({'id': id, 'pos': pos});
  }
  return res;
};

self.getStepCount = function (path) {
  var count = 0;
  var j = -1;

  for (var i = 0; i < path.length; i++) {
    var step = path[i];
    if (step.id != j) {
      j = step.id;
      count++;
    }
  }

  return count;
};

self.getBestResult = function (paths) {
  var res = null;
  var min = Math.pow(2, 53);

  for (var i = 0; i < paths.length; i++) {
    var count = self.getStepCount(paths[i]);
    if (count < min) {
      res = paths[i];
      min = count;
    }
  }

  console.log(min);

  return res;
};

self.addEventListener('message', function(e) {
  var paths = [];
  var result = [];
  var tiles = e.data;

  var visited = {};
  var queue = [];
  var level = 0;

  // Initial state
  var grid;
  var path;
  var key = self.getKey(tiles);
  visited[key] = true;

  queue.push({
    tiles: self.copy(tiles),
    path: []
  });

  queue.push(null);

  // BFS
  while (queue.length > 0) {
    // dequeue
    var state = queue[0];
    queue.splice(0, 1);

    if (self.isObject(state)) {
      grid = self.getGrid(state.tiles);

      // check if it's complete
      if (self.pass(state.tiles)) {
        paths.push(self.copy(state.path));
      }

      // generate every possible state by each tile
      for (var i = 0; i < state.tiles.length; i++) {
        var tile = state.tiles[i];

        // up
        if (self.canMoveUp(tile, grid)) {
          tile.pos -= 4;
          key = self.getKey(state.tiles);

          if (!visited.hasOwnProperty(key)) {
            visited[key] = true;

            queue.push({
              tiles: self.copy(state.tiles),
              path: self.addPath(state.path, tile.id, -4)
            });
          }

          tile.pos += 4;
        }

        // down
        if (self.canMoveDown(tile, grid)) {
          tile.pos += 4;
          key = self.getKey(state.tiles);

          if (!visited.hasOwnProperty(key)) {
            visited[key] = true;

            queue.push({
              tiles: self.copy(state.tiles),
              path: self.addPath(state.path, tile.id, 4)
            });
          }

          tile.pos -= 4;
        }

        // left
        if (self.canMoveLeft(tile, grid)) {
          tile.pos -= 1;
          key = self.getKey(state.tiles);

          if (!visited.hasOwnProperty(key)) {
            visited[key] = true;

            queue.push({
              tiles: self.copy(state.tiles),
              path: self.addPath(state.path, tile.id, -1)
            });
          }

          tile.pos += 1;
        }

        // right
        if (self.canMoveRight(tile, grid)) {
          tile.pos += 1;
          key = self.getKey(state.tiles);

          if (!visited.hasOwnProperty(key)) {
            visited[key] = true;

            queue.push({
              tiles: self.copy(state.tiles),
              path: self.addPath(state.path, tile.id, 1)
            });
          }

          tile.pos -= 1;
        }
      }

    } else {
      if (queue.length > 0) {
        queue.push(null);
      }
    }
  }

  // find the minimum one
  result = self.getBestResult(paths);

  postMessage(result);

}, false);
