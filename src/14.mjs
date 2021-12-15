import { getLines, sectionalize } from "./helpers.mjs";

let [[template], rules] = await getLines(sectionalize);
rules = Object.fromEntries(
  rules.map((rule) => rule.split("->").map((c) => c.trim()))
);

const getInserts = (template, rules) => {
  const start_rules = Object.keys(rules);
  const inserts = [];
  for (let i = 0; i < template.length - 1; i += 1) {
    const window = template.substr(i, 2);
    if (start_rules.includes(window)) {
      inserts.push({ position: i + 1, insert: rules[window] });
    }
  }
  return inserts;
};

const runInserts = (template, inserts) => {
  let adjusted = Array.from(template);
  inserts.forEach(({ position, insert }, i) => {
    adjusted.splice(position + i, 0, insert);
  });
  return adjusted.join("");
};

const getAndRunInserts = (template, rules) => {
  const inserts = getInserts(template, rules);
  return runInserts(template, inserts);
};

const STEPS = 10;

let polymer = template;
for (let i = 0; i < STEPS; i += 1) {
  polymer = getAndRunInserts(polymer, rules);
}

const countsSorted = (polymer) => {
  return Object.entries(
    Array.from(polymer).reduce((hash, char) => {
      if (!hash[char]) hash[char] = 0;
      hash[char] += 1;
      return hash;
    }, {})
  ).sort(([charA, countA], [charB, countB]) => {
    return countA < countB ? -1 : 1;
  });
};

const [least, ...rest] = countsSorted(polymer);
const [most] = rest.reverse();

console.log(`\n\n> ${most[1] - least[1]}`);
