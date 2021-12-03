import { once } from 'events';
import readline from 'readline';

export const input = readline.createInterface({
  input: process.stdin,
});

export const getLines = async () => {
  const lines = [];
  input.on('line', line => lines.push(line));
  await once(input, 'close');
  return lines;
}