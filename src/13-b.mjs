import { getLines, multiArray } from "./helpers.mjs";

const lines = await getLines();
const dots = [];
const folds = [];
for (const line of lines) {
  if (line.trim().length === 0) continue;
  if (line.indexOf("fold") !== -1) {
    const fold_line = line.substr("fold along".length).trim();
    folds.push(fold_line.split(/=/));
  } else {
    dots.push(line.split(/,/).map((pos) => parseInt(pos, 10)));
  }
}

const x_values = dots.map(([x]) => x);
const y_values = dots.map(([, y]) => y);
const [max_x] = x_values.sort((a, b) => (a < b ? -1 : 1)).reverse();
const [max_y] = y_values.sort((a, b) => (a < b ? -1 : 1)).reverse();

const printPaper = (paper) => {
  paper.forEach((row) => {
    row.forEach((col) => {
      process.stdout.write(`${col === true ? "#" : "."}`);
    });
    console.log();
  });
};

const paperFromDots = (dots) => {
  const paper = multiArray(max_y + 1, max_x + 1, false);
  // console.log(paper);
  for (const [x, y] of dots) {
    paper[y][x] = true;
  }
  return paper;
};

const foldPaper = (paper, axis, fold_line) => {
  return paper.map((row, y) => {
    return row.map((col, x) => {
      if (axis === "x") {
        // fold left
        if (x > fold_line) return false;
        const virt_x = fold_line * 2 - x;
        return col || paper[y][virt_x];
      } else {
        // fold up
        if (y > fold_line) return false;
        const virt_y = fold_line * 2 - y;
        return col || paper[virt_y][x];
      }
    });
  });
};

const trimPaper = (paper, max_x = null, max_y = null) => {
  if (!max_x || !max_y) {
    max_x = 0;
    max_y = 0;
    paper.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col) {
          if (x > max_x) max_x = x;
          if (y > max_y) max_y = y;
        }
      });
    });
  }
  const trimmed_paper = multiArray(max_y+ 1, max_x+1, false);
  return trimmed_paper.map((row, y) => {
    return row.map((col, x) => {
      return paper[y][x];
    });
  });
};

let paper = paperFromDots(dots);

for (const [axis, coord] of folds) {
  const next_paper = foldPaper(paper, axis, coord);
  paper = next_paper;
  // console.log(`\nfold ${axis}=${coord}`);
  // printPaper(paper);
}

printPaper(trimPaper(paper));

const dots_visible = paper.flatMap((row) => row.filter((col) => col)).length;

console.log(`\n\n>${dots_visible}`);
