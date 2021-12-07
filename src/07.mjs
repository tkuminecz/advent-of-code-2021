import { getLines } from './helpers.mjs';

const [input] = await getLines();

const crabs = input.split(/,/g).map(v => parseInt(v, 10));

console.log(crabs);

let min = Infinity;
let max = -Infinity;
crabs.forEach(pos => {
  if (pos < min) min = pos;
  if (pos > max) max = pos;
});

console.log({min,max})

const costs = {};

for (let i = min; i <= max; i += 1) {
  const each_costs = crabs.map(pos => Math.abs(pos - i));
  costs[i] = each_costs.reduce((acc, curr) => acc + curr, 0);
}

console.log(costs)
let min_cost = Infinity;
let min_align;
Object.entries(costs).forEach(([position, cost]) => {
  if (cost < min_cost) {
    min_cost = cost;
    min_align = position;
  }
})

console.log({min_cost, min_align})