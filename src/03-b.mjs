import { input } from './helpers.mjs';

const lines = [];
const common = [];

for await (const line of input) {
  lines.push(line);
  const digits = Array.from(line);
  digits.forEach((digit, i) => {
    if (common[i] == null) {
      common[i] = 0;
    }
    switch (digit) {
      case '0':
        common[i] -= 1;
        break;

      case '1':
        common[i] += 1;
        break;

      default:
        break;
    }
  });
}

const calculateCommons = (rows) => {
  const cmn = [];
  for (const row of rows) {
    row.forEach((digit, i) => {
      if (cmn[i] == null) {
        cmn[i] = 0;
      }
      switch (digit) {
        case 0:
          cmn[i] -= 1;
          break;

        case 1:
          cmn[i] += 1;
          break;
      }
    });
  }
  return cmn;
};

// gamma is most common
const gamma = common.map(deviation => deviation > 0 ? 1 : 0);

// epsilon is least common
const epsilon = common.map(deviation => deviation > 0 ? 0 : 1);

const digit_lines = lines.map(line => Array.from(line).map(digit => parseInt(digit, 10)));

let oxygen_filtered = [].concat(digit_lines);
let co2_filtered = [].concat(digit_lines);

let oxygen_rating;
let co2_rating;

common.forEach((_, i) => {
  const o2_commons = calculateCommons(oxygen_filtered);
  const target_oxygen_digit = o2_commons[i] >= 0 ? 1 : 0;
  oxygen_filtered = oxygen_filtered.filter(digits => {
    return digits[i] === target_oxygen_digit;
  });
  if (oxygen_filtered.length === 1) {
    oxygen_rating = oxygen_filtered[0];
  }

  const co2_commons = calculateCommons(co2_filtered);
  const target_co2_digit = co2_commons[i] >= 0 ? 0 : 1;
  co2_filtered = co2_filtered.filter(digits => {
    return digits[i] === target_co2_digit;
  });
  if (co2_filtered.length === 1) {
    co2_rating = co2_filtered[0];
  }
});

const toDecimal = (digits) => {
  return [...digits].reverse().reduce((acc, digit, exp) => {
    const digitValue = digit * Math.pow(2, exp);
    return acc + digitValue;
  }, 0);
}

const gammaDecimal = toDecimal(gamma);
const epsilonDecimal = toDecimal(epsilon);

console.log(`\n\n> ${toDecimal(oxygen_rating) * toDecimal(co2_rating)}`);
