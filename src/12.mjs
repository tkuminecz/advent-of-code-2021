import chalk from "chalk";
import path from "path";
import { inspect } from "util";
import { getLines } from "./helpers.mjs";

const conns = (await getLines()).map((line) => line.split(/-/g));

const isLarge = (label) => label[0] === label[0].toUpperCase();
const isSmall = (label) => !isLarge(label);

const buildGraph = (cns) => {
  const graph = {};
  for (const conn of cns) {
    const [from, to] = conn;
    if (!graph[from]) graph[from] = new Set();
    graph[from].add(to);
    if (!graph[to]) graph[to] = new Set();
    graph[to].add(from);
  }
  return graph;
};

const graph = buildGraph(conns);

const indent = (n) => (n > 0 ? new Array(n).fill("  ").join("") : "");

const getTimesInPath = (path, cave) => {
  return path.filter((c) => c === cave).length || 0;
};

const getAllowedTargets = (graph, path_so_far, node) => {
  const targets = Array.from(graph[node]);
  if (node === "end") return [];
  return targets.filter((target_cave) => {
    if (target_cave === "start") return false;
    if (isSmall(target_cave)) {

      const new_path_so_far = [...path_so_far, node];

      const small_caves = new_path_so_far.filter((cave) => isSmall(cave));

      const small_cave_counts = small_caves.reduce((hash, cave) => {
        hash[cave] = getTimesInPath(new_path_so_far, cave);
        return hash;
      }, {});
      // small_cave_counts[target_cave] += 1;

      // const caves_over_two = Object.values(small_cave_counts).filter(v => v > 1);
      // console.log(`${indent(path_so_far.length)}${path_so_far}`, small_cave_counts, node)

      const times_in_path = getTimesInPath(new_path_so_far, target_cave)

      // return times_in_path < 2 ? true : caves_over_two.length<= 1;

      // return caves_over_two.length <= 1;

      const any_small_caves_twice = Object.entries(small_cave_counts).some(
        ([cave, count]) => count === 2
      );


      return times_in_path === 0 ? true : any_small_caves_twice === false;

      // if (times_in_path > 0) {
      //   const any_twice = small_cave_counts.some((c) => c > 1);
      //   return !any_twice;
      // }
      // return true;
      // return !any_twice && times_in_path < 2;
      // const less_than_twice = times_in_path < 2;
      // return less_than_twice;
    }
    return true;
  });
};

const final_paths = [];

const traverseFromNode = (graph, node, path_so_far) => {
  const allowed_targets = getAllowedTargets(graph, path_so_far, node);
  // console.log(
  //   `${indent(path_so_far.length)}${path_so_far.join(" ")} ${node}`,
  //   "->",
  //   allowed_targets
  // );
  const target_paths = [];
  if (allowed_targets.length === 0) {
    // No more moves to make
    const final_path = [...path_so_far, node];
    // console.log(
    //   `${indent(path_so_far.length)}----> ${chalk.bold(final_path.join(" "))}`
    // );
    final_paths.push(final_path);
  }
  for (const target of allowed_targets) {
    target_paths.push(
      traverseFromNode(graph, target, path_so_far.concat([node]))
    );
  }
  return target_paths;
};

traverseFromNode(graph, "start", []);

const unique_paths = Array.from(new Set(final_paths))
  .filter((path) => {
    const [last] = [...path].reverse();
    return last === "end";
  })
  .sort((a, b) => a.join(",").localeCompare(b.join(",")));

// unique_paths.forEach((p) => console.log(p.join(",")));
console.log(`\n\n> ${unique_paths.length}`);
