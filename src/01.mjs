import { input } from './helpers';

let incremented = 0;
let last;

let window = [];

for await (const line of input) {
  const current = parseInt(line, 10);
  if (!isNaN(current)) {
    // Part 1
    if (last && last < current) {
      incremented += 1;
    }
    last = current;
  }
}

console.log(`${incremented} were incremented`)

