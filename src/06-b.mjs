import { getLines } from "./helpers.mjs";

const DAYS = 256;
const REPRO_DAYS = 7;
const MATURATION_DAYS = 2;

const [input] = await getLines();
const fishes = input.split(/,/g).map((timer) => parseInt(timer, 10));
let groups = {};
for (const fish of fishes) {
  if (groups[fish] == null) groups[fish] = 0;
  groups[fish] += 1;
}

const getTotalFish = (grps) => {
  return Object.values(grps).reduce((acc, curr) => acc + curr, 0);
};

const printGroups = (grps) => {
  console.log(`total fish: ${getTotalFish(grps)}`);
  Object.entries(grps).forEach(([timer, count]) => {
    console.log(` ${timer}: ${count}`);
  });
};

printGroups(groups);

for (let day = 0; day < DAYS; day += 1) {
  const new_groups = {};
  for (const key in groups) {
    new_groups[`${key - 1}`] = groups[key];
  }

  // Handle fish who are reproducing
  const reproducing = new_groups["-1"] || 0;
  delete new_groups["-1"];

  const REPRO_KEY = `${REPRO_DAYS - 1}`;
  if (new_groups[REPRO_KEY] == null) new_groups[REPRO_KEY] = 0;
  new_groups[REPRO_KEY] += reproducing;

  const SPAWN_KEY = `${REPRO_DAYS + MATURATION_DAYS - 1}`;
  if (new_groups[SPAWN_KEY] == null) new_groups[SPAWN_KEY] = 0;
  new_groups[SPAWN_KEY] += reproducing;

  groups = new_groups;
}

console.log(`\n\n> ${getTotalFish(groups)}`);