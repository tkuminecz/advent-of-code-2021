import { inspect } from "util";
import { input } from "./helpers.mjs";

const vents = [];

for await (const line of input) {
  const [fromStr, toStr] = line.split(/\s->\s/g);
  if (fromStr && toStr) {
    const [fromX, fromY] = fromStr.split(/,/g);
    const [toX, toY] = toStr.split(/,/g);
    vents.push({
      x1: parseInt(fromX, 10),
      y1: parseInt(fromY, 10),
      x2: parseInt(toX, 10),
      y2: parseInt(toY, 10),
    });
  }
}

const cols = 1000;
const rows = 1000;
const size = (cols + 1) * (rows + 1);
const diagram = new Array(size).fill(0);

const getIndex = (x, y) => {
  const idx = x + y * cols;
  if (idx > diagram.length) {
    console.error(`ARRAY OVERFLOW: index ${idx} from coords x ${x}/ y ${y}`);
  }
  return idx;
};

const getInc = (slope) => {
  if (slope === 0) return 0;
  return slope > 0 ? 1 : -1;
};

const plot_on_diagram = (vent, dgm) => {
  const inc_x = getInc(vent.x2 - vent.x1);
  const inc_y = getInc(vent.y2 - vent.y1);

  let x = vent.x1;
  let y = vent.y1;
  let idx = getIndex(x, y);
  dgm[idx] += 1;

  while (x !== vent.x2 || y !== vent.y2) {
    x += inc_x;
    y += inc_y;
    idx = getIndex(x, y);
    dgm[idx] += 1;
  }
};

for (const vent of vents) {
  plot_on_diagram(vent, diagram);
}

const over_2_overlap = diagram.reduce(
  (acc, entry) => (entry > 1 ? acc + 1 : acc),
  0
);

console.log(`\n\n> ${over_2_overlap}`);
