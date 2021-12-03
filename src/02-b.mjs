import { input } from './helpers.mjs';

let horiz = 0;
let depth = 0;
let aim = 0;

for await (const line of input) {
  const [direction, amountStr] = line.split(/\s+/);
  const amount = parseInt(amountStr, 10);
  switch (direction) {
    case 'forward':
      horiz += amount;
      depth += aim * amount;
      break;

    case 'down':
      aim += amount;
      break;

    case 'up':
      aim -= amount;
      break;

    default:
  }
}

console.log(`\n\n> ${depth * horiz}`)