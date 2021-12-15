import _ from "lodash";
import chalk from "chalk-template";
import { getLines } from "./helpers.mjs";

const Direction = {
  // Up: "Up",
  Right: "Right",
  Down: "Down",
  // Left: "Left",
};

const input_grid = await getLines((lines) =>
  lines.map((line) => line.split("").map((c) => parseInt(c, 10)))
);

const COLS = input_grid[0].length;
const ROWS = input_grid.length;

const isInBounds = (x, y) => {
  if (x < 0 || y < 0) return false;
  if (x >= COLS || y >= ROWS) return false;
  return true;
};

const printMapWithPath = (map, path) => {
  map.forEach((row, y) => {
    row.forEach((col, x) => {
      process.stdout.write(
        isInPath(path, x, y) ? chalk`{bold.blue ${col}}` : chalk`{dim ${col}}`
      );
    });
    process.stdout.write("\n");
  });
};

const indent = (n) => {
  return new Array(n).fill(null).join(" ");
};

const resolvePath = (path) => {
  return path.map((coord) => {
    const [x, y] = coord;
    return input_grid[y][x];
  });
};

const chain = (path) => {
  return path.join(chalk`{grey.dim -}`);
};

const isValidPath = (path) => {
  const [x, y] = path[path.length - 1];
  return x === COLS - 1 && y == ROWS - 1;
};

const isInPath = (path, x, y) => {
  return (
    path.filter((coord) => {
      const [a, b] = coord;
      return a === x && b === y;
    }).length > 0
  );
};

const getNextCoord = (x, y, direction) => {
  switch (direction) {
    case Direction.Up:
      return [x, y - 1];

    case Direction.Right:
      return [x + 1, y];

    case Direction.Down:
      return [x, y + 1];

    case Direction.Left:
      return [x - 1, y];
  }
};

const isValidMove = (path, x, y, x0, y0) => {
  const last_score = input_grid[y0][x0];
  const this_score = input_grid[y][x];
  console.log(path, last_score, this_score);
  return this_score <= last_score && isInBounds(x, y) && !isInPath(path, x, y);
};

const uniquePaths = (paths) => {
  return _.uniqBy(paths, (path) => {
    return path.map((p) => p.join(",")).join("-");
  });
};

const scorePath = (path) => {
  const path_minus_start = path.slice(1);
  const resolved = resolvePath(path_minus_start);
  return resolved.reduce((sum, score) => sum + score, 0);
};

const walk = (x = 0, y = 0, path_so_far = []) => {
  const next_path_so_far = path_so_far.concat([[x, y]]);
  const indentation = indent(path_so_far.length + 1);
  // console.log(
  //   `${indentation}(${x}, ${y}) ${chain(
  //     resolvePath(input_grid, next_path_so_far)
  //   )}`
  // );

  const directional_paths = Object.keys(Direction).flatMap((direction) => {
    const [x2, y2] = getNextCoord(x, y, direction);
    const valid = isValidMove(path_so_far, x2, y2, x, y);

    if (valid) {
      // console.log(
      //   chalk`${indentation} {blue ${direction}}`
      // );
      return uniquePaths(walk(x2, y2, next_path_so_far));
    }
    // Dead end
    return isValidPath(next_path_so_far) ? [next_path_so_far] : [];
  });

  return directional_paths;
};

const output_paths = walk();

console.log({output_paths})

const paths_with_scores = output_paths
  .map((path) => {
    return [path, scorePath(path)];
  })
  .sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  });

console.log({paths_with_scores})

const [[lowest_risk_path, lowest_score]] = paths_with_scores;

console.log(chain(resolvePath(lowest_risk_path)), lowest_score);
printMapWithPath(input_grid, lowest_risk_path);
