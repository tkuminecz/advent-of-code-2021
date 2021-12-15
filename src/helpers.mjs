import { once } from "events";
import readline from "readline";

export const input = readline.createInterface({
  input: process.stdin,
});

export const getLines = async (process) => {
  const lines = [];
  input.on("line", (line) => lines.push(line));
  await once(input, "close");
  if (process) {
    return process(lines);
  }
  return lines;
};

export const sectionalize = (lines) => {
  let curr_section = [];
  const sections = [curr_section];
  let encounterd_empty = false
  for (const line of lines) {
    if (line.trim().length === 0) {
      encounterd_empty = true;
    } else {
      if (encounterd_empty) {
        const new_section = [];
        sections.push(new_section);
        curr_section = new_section;
        encounterd_empty = false;
      }
      curr_section.push(line);
    }
  }
  return sections;
};

export const multiArray = (rows, cols, fill = null) => {
  return new Array(rows)
    .fill(null)
    .map((row) =>
      new Array(cols).fill(typeof fill == "function" ? fill() : fill)
    );
};
