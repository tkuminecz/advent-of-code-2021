import { input } from './helpers.mjs';

const common = [];

for await (const line of input) {
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

const gamma = common.map(deviation => deviation > 0 ? 1 : 0);
const epsilon = common.map(deviation => deviation > 0 ? 0 : 1);

const toDecimal = (digits) => {
  return [...digits].reverse().reduce((acc, digit, exp) => {
    const digitValue = digit * Math.pow(2, exp);
    return acc + digitValue;
  }, 0);
}

const gammaDecimal = toDecimal(gamma);

const epsilonDecimal = toDecimal(epsilon);

console.log(`\n\n> ${gammaDecimal * epsilonDecimal}`);
