import { getLines } from "./helpers.mjs";

const a = "a";
const b = "b";
const c = "c";
const d = "d";
const e = "e";
const f = "f";
const g = "g";

const t = "t";
const u = "u";
const v = "v";
const w = "w";
const x = "x";
const y = "y";
const z = "z";

const notes = (await getLines()).map((input) =>
  input.split(/\|/).map((s) => s.trim().split(/\s+/g))
);

const init_mappings = () => ({
  t: [a, b, c, d, e, f, g],
  u: [a, b, c, d, e, f, g],
  v: [a, b, c, d, e, f, g],
  w: [a, b, c, d, e, f, g],
  x: [a, b, c, d, e, f, g],
  y: [a, b, c, d, e, f, g],
  z: [a, b, c, d, e, f, g],
});

const print_mappings = (mappings) => {
  Object.keys(mappings).forEach((m) => {
    console.log(`${m}: ${mappings[m].join(",")}`);
  });
};

const get_segments_for_digit = (digit) => {
  switch (digit) {
    case 0:
      return [t, u, v, x, y, z];

    case 1:
      return [v, y];

    case 2:
      return [t, v, w, x, z];

    case 3:
      return [t, v, w, y, z];

    case 4:
      return [u, v, w, y];

    case 5:
      return [t, u, w, y, z];

    case 6:
      return [t, u, w, x, y, z];

    case 7:
      return [t, v, y];

    case 8:
      return [t, u, v, w, x, y, z];

    case 9:
      return [t, u, v, w, y, z];
  }
};

const refine_mappings = (digits, signal, mappings) => {
  const wires = signal.split("");
  console.log("+", signal, digits.join(","));
  const filter_segments = (segment) => {
    mappings[segment] = mappings[segment].filter((w) => wires.includes(w));
  };

  // [...new Set(digits.flatMap(get_segments_for_digit))].forEach(filter_segments);

  digits.forEach((digit) => {
    const segs = get_segments_for_digit(digit);
    console.log(` ${digit} -> ${segs.join(",")}`);
    segs.forEach(filter_segments);
    print_mappings(mappings);
  });
  // print_mappings(mappings);
  console.log();
};

const get_candidate_digits = (signal, mappings) => {
  switch (signal.length) {
    case 2:
      return [1];

    case 3:
      return [7];

    case 4:
      return [4];

    case 5:
      return [2, 3, 5];

    case 6:
      return [0, 6, 9];

    case 7:
      return [8];
  }
};

const refine = (signals, mappings) => {
  const run_cycle = () => {
    signals.forEach((signal) => {
      const cand_digits = get_candidate_digits(signal, mappings);
      refine_mappings(cand_digits, signal, mappings);
    });
    console.log(mappings);
  };
  run_cycle();
};

const refine_until_done = (signals) => {
  refine(signals, init_mappings());
};

notes.map(([signal_patterns]) => refine_until_done(signal_patterns));
