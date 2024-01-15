import { rng } from ".";
import { Piece } from "../types";

const bag7 = (seed: number) => {
  const gen = rng(seed);
  return () => gen.shuffleArray(["Z", "L", "O", "S", "I", "J", "T"] as Piece[]);
};

export default bag7;
