import { getLines } from "./helpers.mjs";

const lines = (await getLines()).map((lines) =>
  lines.split("").map((digit) => parseInt(digit, 10))
);

const findLows = (map) => {
  const lows = [];
  for (let y = 0; y < map.length; y += 1) {
    const row = map[y];
    for (let x = 0; x < row.length; x += 1) {
      const cell_value = map[y][x];

      // compare to vertical neighbors
      let lower_than_vert_neighbors;
      if (y === 0) {
        // top edge
        lower_than_vert_neighbors = cell_value < map[y + 1][x];
      } else if (y === map.length - 1) {
        // bottom edge
        lower_than_vert_neighbors = cell_value < map[y - 1][x];
      } else {
        lower_than_vert_neighbors =
          cell_value < map[y - 1][x] && cell_value < map[y + 1][x];
      }

      // compare to horizontal neighbors
      let lower_than_horiz_neighbors;
      if (x === 0) {
        // left edge
        lower_than_horiz_neighbors = cell_value < map[y][x + 1];
      } else if (x === row.length - 1) {
        // right edge
        lower_than_horiz_neighbors = cell_value < map[y][x - 1];
      } else {
        lower_than_horiz_neighbors =
          cell_value < map[y][x - 1] && cell_value < map[y][x + 1];
      }

      if (lower_than_horiz_neighbors && lower_than_vert_neighbors) {
        lows.push([x, y]);
      }
    }
  }
  return lows;
};

const getRiskLevel = (x, y) => {
  return lines[y][x] + 1;
};

const lows = findLows(lines);

const sum_of_lows = lows.reduce((acc, low) => {
  const [x, y] = low;
  return acc + getRiskLevel(x, y);
  ƒ;
}, 0);

console.log(`\n\n> ${sum_of_lows}`);
