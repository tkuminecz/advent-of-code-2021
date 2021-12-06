import { getLines } from './helpers.mjs';

const DAYS = 80;
const REPRO_DAYS = 7;
const MATURATION_DAYS = 2;

const [input] = await getLines();
let fishes = input.split(/,/g).map(timer => parseInt(timer, 10));



for (let day = 0; day < DAYS; day += 1) {
  fishes = fishes.flatMap(fish => {
    fish -= 1;
    if (fish < 0) {
      return [REPRO_DAYS - 1, REPRO_DAYS - 1 + MATURATION_DAYS];
    }
    return [fish];
  });
}

console.log(`\n\n> ${fishes.length}`);