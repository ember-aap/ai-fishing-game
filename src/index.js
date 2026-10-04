import { Game } from './parser.js';
export function createGame(seed) {
  const game = new Game(seed);
  return {
    command: (str) => game.command(str),
    save: () => game.e.save(),
    load: (s) => { game.e = JSON.parse(s); },
    get engine() { return game.e; },
  };
}
export default createGame;