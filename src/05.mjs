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

const vertical_or_horiz = vents.filter(
  (vent) => vent.x1 === vent.x2 || vent.y1 === vent.y2
);

let max_x = 0,
  max_y = 0;
for (const vert of vertical_or_horiz) {
  if (vert.x1 > max_x) max_x = vert.x1;
  if (vert.x2 > max_x) max_x = vert.x2;
  if (vert.y1 > max_x) max_y = vert.y1;
  if (vert.y2 > max_x) max_y = vert.y2;
}

const cols = max_x + 1;
const rows = max_y + 1;
const size = cols * rows;
const diagram = new Array(size).fill(0);

const getIndex = (x, y) => x + y * cols;

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

for (const vent of vertical_or_horiz) {
  plot_on_diagram(vent, diagram);
}

let over_2_overlap = 0;

diagram.forEach((entry) => {
  if (entry > 1) {
    over_2_overlap += 1;
  }
});

console.log(`\n\n> ${over_2_overlap}`);
