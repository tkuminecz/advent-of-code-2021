import { getLines } from './helpers.mjs';

const [input] = await getLines();
const crabs = input.split(/,/g).map(v => parseInt(v, 10));

let min = Infinity;
let max = -Infinity;
crabs.forEach(pos => {
  if (pos < min) min = pos;
  if (pos > max) max = pos;
});

const getCost = (from, to) => {
  // if (from < to) {
  //   const tmp = from;
  //   from = to;
  //   to = tmp;
  // }
  let sum = 0;
  for (let i = 0; i < Math.abs(from - to); i++) {
    sum += i + 1;
  }
  return sum;
};

const costs = {};
for (let i = min; i <= max; i += 1) {
  const each_costs = crabs.map(pos => getCost(pos, i));
  costs[i] = each_costs.reduce((acc, curr) => acc + curr, 0);
}

let min_cost = Infinity;
let min_align;
Object.entries(costs).forEach(([position, cost]) => {
  if (cost < min_cost) {
    min_cost = cost;
    min_align = position;
  }
})

console.log(`\n\> ${min_cost}`);