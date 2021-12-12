import chalk from "chalk";
import { getLines } from "./helpers.mjs";

const grid = (await getLines()).map((line) => {
  return line.split("").map((val) => parseInt(val, 10));
});
console.log("\n\n");

const printGrid = (grid) => {
  grid.forEach((row) => {
    console.log(
      row.map((val) => (val === 0  ? chalk.red(val) : val)).join("")
    );
  });
  console.log();
};

const spawnGrid = (dflt = null) => {
  const grid = new Array(10).fill(null);
  grid.forEach((r, i) => {
    grid[i] = new Array(10).fill(dflt);
  });
  return grid;
};

const iterateGrid = (g, cb) => {
  g.forEach((row, y) => {
    row.forEach((val, x) => {
      cb(val, x, y, g);
    });
  });
};

printGrid(grid);

const shouldFlash = (grid, already) => {
  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[i].length; j += 1) {
      if (grid[i][j] > 9 && already[i][j] !== true) {
        return true;
      }
    }
  }
  return false;
};

const bump = (grid, y, x) => {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[y].length) {
    grid[y][x] += 1;
  }
};

const runStep = (grid) => {
  let n_flashes = 0;
  const new_grid = grid.map((row) => {
    return row.map((val) => val + 1);
  });
  const already_flashed = spawnGrid(false);
  const runFlash = () => {
    for (let y = 0; y < new_grid.length; y += 1) {
      for (let x = 0; x < new_grid[y].length; x += 1) {
        if (new_grid[y][x] > 9 && already_flashed[y][x] !== true) {
          // this cell needs to flash
          bump(new_grid, y - 1, x - 1);
          bump(new_grid, y - 1, x);
          bump(new_grid, y - 1, x + 1);

          bump(new_grid, y, x - 1);
          bump(new_grid, y, x + 1);

          bump(new_grid, y + 1, x - 1);
          bump(new_grid, y + 1, x);
          bump(new_grid, y + 1, x + 1);

          already_flashed[y][x] = true;
        }
      }
    }
  };
  // printGrid(new_grid);
  while (shouldFlash(new_grid, already_flashed)) {
    // console.log('¬ flashing')
    runFlash(new_grid);
    // printGrid(new_grid);
  }
  iterateGrid(new_grid, (v, x, y) => {
    if (already_flashed[y][x] === true) {
      new_grid[y][x] = 0;
      n_flashes += 1;
    }
  });
  return [new_grid, n_flashes];
};

let new_grid = grid;
let flashes_this_step;

const N_STEPS = 10000;
let total_flashes = 0;
for (let i = 0; i < N_STEPS; i += 1) {
  console.log(`Step ${i + 1}`);
  const [g, f] = runStep(new_grid);
  console.log(`after step ${i + 1}`, f);
  printGrid(g);
  console.log();
  new_grid = g;
  flashes_this_step = f;
  total_flashes += f;
  if (flashes_this_step === 100) {
    // All octopi flashed
    console.log(`\n\n> ${i + 1}`);
    process.exit(0);
  }
}
