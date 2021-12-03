import { input } from './helpers.mjs';

let horiz = 0;
let depth = 0;

for await (const line of input) {
  const [direction, amountStr] = line.split(/\s+/);
  const amount = parseInt(amountStr, 10);
  // console.log({direction, amount});
  switch (direction) {
    case 'forward':
      horiz += amount;
      break;

    case 'down':
      depth += amount;
      break;

    case 'up':
      depth -= amount;
      break;

    default:
  }
}

console.log(`> ${depth * horiz}`)