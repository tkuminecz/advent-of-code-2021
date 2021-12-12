import { getLines } from "./helpers.mjs";

const lines = (await getLines()).map((line) => line.split(""));

const PAIRS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const OPENERS = ["(", "[", "{", "<"];
const isOpener = (char) => OPENERS.includes(char);

const CLOSERS = [")", "]", "}", ">"];
const isCloser = (char) => CLOSERS.includes(char);

const SCORES = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

console.log();

const VALID = 0;
const CORRUPTED = 1;
const INCOMPLETE = 2;

const statusToText = (status) => {
  return status === VALID
    ? "Valid"
    : status === CORRUPTED
    ? "Corrupted"
    : "Incomplete";
};

const validateLine = (line) => {
  const stack = [];
  for (const char of line) {
    // console.log(stack);
    if (isOpener(char)) {
      stack.push(char);
    } else if (isCloser(char)) {
      const last = stack.pop();
      if (PAIRS[last] !== char) {
        // corrupt
        return [CORRUPTED, char];
      }
    }
  }
  return stack.length === 0 ? [VALID] : [INCOMPLETE];
};

let score = 0;
for (const line of lines) {
  const [status, illegal_char] = validateLine(line);
  if (status === CORRUPTED) {
    const syntax_error_score = SCORES[illegal_char];
    score += syntax_error_score;
  }
}

console.log(`\n\n> ${score}`)