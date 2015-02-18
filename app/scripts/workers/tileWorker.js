/**
 * Created by su on 2/13/15.
 */

'use strict';

var ROW = 5;
var COL = 4;

var isObject = function (val) {
  if (val === null) {
    return false;
  }

  return ((typeof val === 'function') || (typeof val === 'object'));
};

var copy = function (obj) {
  var out, i;

  if (Object.prototype.toString.call(obj) === '[object Array]') {
    out = [];
    i = 0;
    var len = obj.length;

    for (; i < len; i++) {
      out[i] = copy(obj[i]);
    }

    return out;
  }

  if (typeof obj === 'object') {
    out = {};

    for (i in obj) {
      out[i] = copy(obj[i]);
    }

    return out;
  }

  return obj;
};

/**
 *
 * @param tiles
 */
var pass = function (tiles) {
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
var getGrid = function (tiles) {
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

var printGrid = function (grid) {
  for (var i = 0; i < ROW; i++) {
    console.log(grid[i]);
  }
};

/**
 *
 * @param grid
 */
var getKey = function (tiles) {
  var grid = getGrid(tiles);
  var i, j, k = -1, c = 0, key = 0;

  for (i = 0; i < ROW; i++) {
    for (j = 0; j < COL; j++) {
      var type = grid[i][j];
      var pos = i * COL + j;

      if (type === 9 && k === -1) {
        k = pos;
        key += pos * Math.pow(2, 32);
      } else if (type !== 9) {
        key += type * Math.pow(2, (c++) * 2);
      }
    }
  }

  return key;
};

var calPos = function (row, col) {
  return row * 4 + col;
};

var getNeighbors = function (grid, pos, type, visited) {
  var res = [];

  var row = parseInt(pos / 4),
      col = parseInt(pos % 4);

  switch (type) {
    // type 1
    case 1:
      // up
      if (row > 0 && grid[row - 1][col] === 0) {
        res.push(calPos(row - 1, col));
      }

      // right
      if (col < 3 && grid[row][col + 1] === 0) {
        res.push(calPos(row, col + 1));
      }

      // left
      if (col > 0 && grid[row][col - 1] === 0) {
        res.push(calPos(row, col - 1));
      }

      // down
      if (row < 4 && grid[row + 1][col] === 0) {
        res.push(calPos(row + 1, col));
      }

      break;

    // type 2
    case 2:
      // up
      if (row > 0 && grid[row - 1][col] === 0 && grid[row - 1][col + 1] === 0) {
        res.push(calPos(row - 1, col));
      }

      // right
      if (col < 2 && grid[row][col + 2] === 0) {
        res.push(calPos(row, col + 1));
      }

      // left
      if (col > 0 && grid[row][col - 1] === 0) {
        res.push(calPos(row, col - 1));
      }

      // down
      if (row < 4 && grid[row + 1][col] === 0 && grid[row + 1][col + 1] === 0) {
        res.push(calPos(row + 1, col));
      }

      break;

    // type 3
    case 3:
      // up
      if (row > 0 && grid[row - 1][col] === 0) {
        res.push(calPos(row - 1, col));
      }

      // right
      if (col < 3 && grid[row][col + 1] === 0 && grid[row + 1][col + 1] === 0) {
        res.push(calPos(row, col + 1));
      }

      // left
      if (col > 0 && grid[row][col - 1] === 0 && grid[row + 1][col - 1] === 0) {
        res.push(calPos(row, col - 1));
      }

      // down
      if (row < 3 && grid[row + 2][col] === 0) {
        res.push(calPos(row + 1, col));
      }

      break;

    // type 9
    case 9:
      // up
      if (row > 0 && grid[row - 1][col] === 0 && grid[row - 1][col + 1] === 0) {
        res.push(calPos(row - 1, col));
      }

      // right
      if (col < 2 && grid[row][col + 2] === 0 && grid[row + 1][col + 2] === 0) {
        res.push(calPos(row, col + 1));
      }

      // left
      if (col > 0 && grid[row][col - 1] === 0 && grid[row + 1][col - 1] === 0) {
        res.push(calPos(row, col - 1));
      }

      // down
      if (row < 3 && grid[row + 2][col] === 0 && grid[row + 2][col + 1] === 0) {
        res.push(calPos(row + 1, col));
      }

      break;
  }

  // remove visited position(s)
  for (var i = res.length - 1; i >= 0; i--) {
    if (visited.hasOwnProperty(res[i])) {
      res.splice(i, 1);
    }
  }

  return res;
};

var isPosInStack = function (stack, pos) {
  for (var i = 0; i < stack.length; i++) {
    if (stack[i].pos === pos) {
      return true;
    }
  }
  return false;
};

/**
 *
 * @param grid
 * @param tile
 * @param path
 * @returns {Array}
 */
var getPaths = function (grid, tile) {
  console.log('generating paths for: ' + tile.id);
  var paths = [];
  var pos = tile.pos;
  var type = tile.type;

  // DFS
  var stack = [];
  var visited = {};
  var path = [];

  // Initial state
  // Format: [current position, parent position]
  stack.push({'pos': pos, 'parent': -1});

  // DFS
  while (stack.length > 0) {
    var p = stack.pop();
    //console.log('pop: ' + p.pos);

    // Add current position to path
    path.push(p.pos);

    // Mark it as visited
    visited[p.pos] = true;

    // Get neighbors
    var neighbors = getNeighbors(grid, p.pos, type, visited);

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!isPosInStack(stack, neighbor)) {
        //console.log(neighbor);
        stack.push({'pos': neighbor, 'parent': p.pos});
      }
    }

    // If all neighbors are visited, we found a path
    if (neighbors.length === 0) {
      //console.log('path: ' + path);
      paths.push(copy(path));

      // trace back to the position which is equal
      // to the parent of the top item in the stack
      if (stack.length > 0) {
        var parent = stack[stack.length - 1].parent;

        while (path.length > 0 && (path[path.length - 1] !== parent)) {
          path.pop();
        }
      }
    }

  }

  //console.log(paths);
  return paths;
};

/**
 *
 * @param tiles
 */
var solve = function (tiles) {
  // BFS
  var visited = {};
  var queue = [];
  var result = [];

  // Mark initial state as visited
  var key = getKey(tiles);
  visited[key] = true;

  // Enqueue initial state
  queue.push({
    tiles: copy(tiles),
    path: []
  });

  queue.push(null);

  // BFS
  while (queue.length > 0) {
    // Dequeue
    var state = queue[0];
    queue.splice(0, 1);

    if (isObject(state)) {
      // Check if it's complete
      if (pass(state.tiles)) {
        result.push(copy(state.path));
      } else {
        // generate every possible state by each tile
        var grid = getGrid(state.tiles);
        var path = state.path;

        console.log('--------------------------');
        printGrid(grid);
        console.log('path: ' + path);

        for (var i = 0; i < state.tiles.length; i++) {
          var tile = state.tiles[i];
          var paths = getPaths(grid, tile);
          console.dir(paths);
        }
      }
    } else {
      console.log('--------------------------');
      if (queue.length > 0) {
        queue.push(null);
      }
    }
  }

  console.log('result:');
  console.log(result);

  return 'Yo';
};

addEventListener('message', function(e) {
  var result = solve(e.data);
  postMessage(result);
}, false);
