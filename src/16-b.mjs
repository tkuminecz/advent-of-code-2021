import _ from "lodash";
import chalk from "chalk-template";
import { getLines } from "./helpers.mjs";

const HEX_TO_BINARY = {
  0: [0, 0, 0, 0],
  1: [0, 0, 0, 1],
  2: [0, 0, 1, 0],
  3: [0, 0, 1, 1],
  4: [0, 1, 0, 0],
  5: [0, 1, 0, 1],
  6: [0, 1, 1, 0],
  7: [0, 1, 1, 1],
  8: [1, 0, 0, 0],
  9: [1, 0, 0, 1],
  A: [1, 0, 1, 0],
  B: [1, 0, 1, 1],
  C: [1, 1, 0, 0],
  D: [1, 1, 0, 1],
  E: [1, 1, 1, 0],
  F: [1, 1, 1, 1],
};

const LENGTH_TYPE_BITS = 0;
const LENGTH_TYPE_NUM_SUBPACKETS = 1;

const [hex_line] = await getLines();
const hex = hex_line.split("");

const toBinary = (hex) => {
  return hex.flatMap((hex_digit) => {
    return HEX_TO_BINARY[hex_digit];
  });
};

const toDecimal = (bin) => {
  let acc = 0;
  const bin_reverse = [...bin].reverse();
  for (let i = 0; i < bin_reverse.length; i += 1) {
    acc += bin_reverse[i] * Math.pow(2, i);
  }
  return acc;
};

const readBits = (binary, num_bits) => {
  const read = binary.slice(0, num_bits);
  binary.splice(0, num_bits);
  return read;
};

const stringify = (binary, c) => {
  if (c) {
    return _.chunk(binary, c)
      .map((bin) => bin.join(""))
      .join(chalk`{dim .}`);
  }
  return binary.join("");
};

const parseLiteral = (version, data) => {
  let acc = [];
  let more = true;
  do {
    const [flag, ...chunk] = readBits(data, 5);
    acc = acc.concat(chunk);
    if (flag === 0) {
      more = false;
    }
  } while (more);
  return {
    type: "literal",
    typeId: 4,
    version,
    value: toDecimal(acc),
    binary: stringify(acc),
  };
};

const parseOperator = (version, type, data) => {
  const length_type = readBits(data, 1);
  switch (toDecimal(length_type)) {
    case LENGTH_TYPE_BITS: {
      const num_bits_data = readBits(data, 15);
      const num_bits = toDecimal(num_bits_data);
      const child_packets_data = readBits(data, num_bits);

      const children = [];
      while (child_packets_data.length > 0) {
        const child = parse(child_packets_data);

        children.push(child);
      }
      return {
        type: "operator",
        version,
        typeId: type,
        subpackets: children,
      };
    }

    case LENGTH_TYPE_NUM_SUBPACKETS: {
      const num_subpackets_data = readBits(data, 11);
      const num_subpackets = toDecimal(num_subpackets_data);
      const children = [];
      for (let i = 0; i < num_subpackets; i += 1) {
        const child = parse(data);
        children.push(child);
      }
      return {
        type: "operator",
        version,
        typeId: type,
        subpackets: children,
      };
    }
  }
};

const parse = (packet) => {
  const version_data = readBits(packet, 3);
  const version = toDecimal(version_data);
  const type = readBits(packet, 3);
  switch (toDecimal(type)) {
    case 4: // literal
      return parseLiteral(version, packet);

    default:
      return parseOperator(version, toDecimal(type), packet);
  }
};

const addVersions = (packet) => {
  let total = packet.version;
  if (packet.subpackets) {
    total += packet.subpackets
      .map(addVersions)
      .reduce((acc, val) => acc + val, 0);
  }
  return total;
};

const evaluatePacket = (packet) => {
  switch (packet.typeId) {
    case 0: // Sum
      return packet.subpackets
        .map(evaluatePacket)
        .reduce((acc, v) => acc + v, 0);

    case 1: // Product
      return packet.subpackets
        .map(evaluatePacket)
        .reduce((acc, v) => acc * v, 1);

    case 2: // Mininum
      const [min] = packet.subpackets
        .map(evaluatePacket)
        .sort((a, b) => (a < b ? -1 : 1));
      return min;

    case 3: // Maximum
      const [max] = packet.subpackets
        .map(evaluatePacket)
        .sort((a, b) => (a > b ? -1 : 1));
      return max;

    case 4: // Literal
      return packet.value;

    case 5: {
      // Greater than
      const [first, second] = packet.subpackets.slice(0, 2).map(evaluatePacket);
      return first > second ? 1 : 0;
    }

    case 6: {
      // Less Than
      const [first, second] = packet.subpackets.slice(0, 2).map(evaluatePacket);
      return first < second ? 1 : 0;
    }

    case 7: {
      // Equal to
      const [first, second] = packet.subpackets.slice(0, 2).map(evaluatePacket);
      return first === second ? 1 : 0;
    }
  }
};

const binary = toBinary(hex);
const packets = parse(binary);

console.log(`\n\n> ${evaluatePacket(packets)}`);
