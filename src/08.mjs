import { getLines } from "./helpers.mjs";

const notes = (await getLines()).map((input) =>
  input.split(/\|/).map((s) => s.trim().split(/\s+/g))
);

const get_digit_from_signal = (signal) => {
  switch (signal.length) {
    case 2: // only the digit "1" uses 2 segments
      return [1];

    case 3:
      return [7];

    case 4:
      return [4];

    case 5:
      // could be 2, 3, or 5
      return [];

    case 6:
      // could be 0, 6, or 9
      return [];

    case 7:
      return 8;

    default:
      return [];
  }
};

const known_digits = notes.flatMap(([signal_patterns, output_value]) =>
  output_value.flatMap(get_digit_from_signal)
);

console.log(`\n\n> ${known_digits.length}`);
