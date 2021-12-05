import chalk from "chalk";
import { getLines } from "./helpers.mjs";

const BOARD_COLS = 5;
const BOARD_ROWS = 5;

const lines = await getLines();

const splitByEmptyLines = (rows) => {
  const buckets = [];
  let encountered_empty = false;
  for (const [i, row] of rows.entries()) {
    if (row.length > 0) {
      if (encountered_empty || i === 0) {
        buckets.push([]);
      }
      buckets[buckets.length - 1].push(row);
      encountered_empty = false;
    } else {
      encountered_empty = true;
    }
  }
  return buckets;
};

const [raw_selected_numbers, ...raw_boards] = splitByEmptyLines(lines);
const selected_numbers = raw_selected_numbers[0]
  .trim()
  .split(/,/g)
  .map((v) => parseInt(v, 10));
const boards = raw_boards.map((rawBoard) =>
  rawBoard.map((line) =>
    line
      .trim()
      .split(/\s+/g)
      .map((v) => parseInt(v, 10))
  )
);

const isWinner = (board, called_numbers) => {
  let solution;

  // Check each row
  for (const row of board) {
    let row_filled = true;
    for (const spot of row) {
      if (!called_numbers.includes(spot)) {
        row_filled = false;
        break;
      }
    }
    if (row_filled) {
      return [true, row];
    }
  }

  // Check each column
  let this_col = [];
  for (let col = 0; col < BOARD_COLS; col += 1) {
    let col_filled = true;
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      const spot = board[row][col];
      this_col.push(spot);
      if (!called_numbers.includes(spot)) {
        col_filled = false;
        break;
      }
    }
    if (col_filled) {
      return [true, this_col];
    }
  }

  // No rows or columns are filled
  return [false];
};

const printBoard = (board, called) => {
  for (const row of board) {
    console.log(
      row
        .map((num) => {
          return called.includes(num) ? chalk.red.bold(num) : chalk.reset(num);
        })
        .join(" ")
    );
  }
};

const getBoardScore = (board, called_numbers) => {
  const unmarked = board.flatMap((row) => {
    return row.filter((col) => !called_numbers.includes(col));
  });
  const unfilled_sum = unmarked.reduce((acc, curr) => acc + curr, 0);
  const [last] = [].concat(called_numbers).reverse();
  return unfilled_sum * last;
};

let available_boards = [...boards];
const winning_groups = [];

for (let i = 0; i < selected_numbers.length; i += 1) {
  const so_far = selected_numbers.slice(0, i + 1);

  const winning_boards = available_boards
    .map((board) => [board, ...isWinner(board, so_far)])
    .filter(([board, won]) => won)
    .map(([board, win, info]) => [board, info]);

  const winning_boards_just_boards = winning_boards.map(([board]) => board);

  if (winning_boards.length > 0) {
    available_boards = available_boards.filter(
      (b) => !winning_boards_just_boards.includes(b)
    );
    winning_groups.push({
      index: i,
      boards: winning_boards_just_boards,
    });
  }
}

for (const group of [].concat(winning_groups).reverse()) {
  if (group.boards.length > 0) {
    const called_numbers = selected_numbers.slice(0, group.index + 1);
    const [last_board] = [].concat(group.boards).reverse();
    console.log(`\n\n> ${getBoardScore(last_board, called_numbers)}`);
    process.exit(0);
  }
}
