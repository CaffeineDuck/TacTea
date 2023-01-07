import { PublicKey } from "@solana/web3.js";

export enum GameStatus {
  WaitingForPlayerTwo,
  Playing,
  Won,
  Lost,
  Tie,
}

type RawGameStatus =
  | { tie: {} }
  | { won: { winner: PublicKey } }
  | { active: {} }
  | { gameCreated: {} };

const tieRaw = JSON.stringify({ tie: {} });
const activeRaw = JSON.stringify({ active: {} });
const gameCreatedRaw = JSON.stringify({ gameCreated: {} });

export function useGameStatus(gameStatus: RawGameStatus, publicKey: PublicKey) {
  console.log(gameStatus);

  const gameStatusString = JSON.stringify(gameStatus);

  if (gameStatusString === tieRaw) return GameStatus.Tie;
  if (gameStatusString === activeRaw) return GameStatus.Playing;
  if (gameStatusString === gameCreatedRaw)
    return GameStatus.WaitingForPlayerTwo;

  // If the game is not active, tie or gameCreated
  if (!gameStatus["won"]) throw new Error("Invalid game status");

  const { won } = gameStatus as { won: { winner: PublicKey } };
  if (won.winner.equals(publicKey)) return GameStatus.Won;
  return GameStatus.Lost;
}
