import { getLines } from "./helpers.mjs";

const lines = (await getLines()).map((line) => line.split(""));

const PAIRS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const REVERSE_PAIRS = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
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
const incomplete_lines = [];
for (const line of lines) {
  const [status, illegal_char] = validateLine(line);
  if (status === CORRUPTED) {
    const syntax_error_score = SCORES[illegal_char];
    score += syntax_error_score;
  } else {
    incomplete_lines.push(line);
  }
}

const completion_scores = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const autocomplete_line = (line) => {
  const stack = [];
  for (const char of line) {
    // console.log(stack);
    if (isOpener(char)) {
      stack.push(char);
    } else if (isCloser(char)) {
      const last = stack.pop();
      if (PAIRS[last] !== char) {
        // corrupt
        throw new Error(
          "somehow encountered a corrupt line, should have been filtered out!"
        );
      }
    }
  }
  const complement = stack.reverse().map((char) => {
    return PAIRS[char];
  });
  return complement;
};

const line_scores = [];
for (const line of incomplete_lines) {
  const finish_chars = autocomplete_line(line);
  const score = finish_chars.reduce((acc, char) => {
    const char_score = completion_scores[char];
    return (acc * 5) + char_score;
  }, 0);
  line_scores.push(score);
}

const sorted_scores = line_scores.sort((a, b) => a < b ? -1 : 1);
const middle_index = ((sorted_scores.length - 1) / 2);
console.log(`\n\n> ${sorted_scores[middle_index]}`);
