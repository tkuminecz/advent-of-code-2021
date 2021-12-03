import { getLines } from './helpers.mjs';

const data = (await getLines()).map(line => parseInt(line, 10));

const getWindowVal = (window) => window.reduce((sum, a) => sum + a, 0);

let num_increased = 0;
let prev_window_value;
for (const [i, reading] of data.entries()) {
  const window = data.slice(Math.max(0, i - 2), i + 1);
  if (window.length === 3) {
    const this_window_val = getWindowVal(window);
    if (prev_window_value && this_window_val > prev_window_value) {
      num_increased += 1;
    }
    prev_window_value = this_window_val;
  }
}

console.log(`\n\n> ${num_increased}`);