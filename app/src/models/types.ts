import { Program } from "@project-serum/anchor";
import { TicTacToe } from "./tictactoe";

export type EndpointTypes = "mainnet" | "devnet" | "localnet";
export type GameState = Awaited<
  ReturnType<Program<TicTacToe>["account"]["game"]["fetch"]>
>;
