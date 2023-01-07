import { useWallet } from "@solana/wallet-adapter-react";
import { GameState } from "components/GameStatus";
import { useAnchorProgram } from "hooks/useAnchorProgram";
import { useBoard } from "hooks/useBoard";
import { useGameStatus } from "hooks/useGameStatus";
import { usePlayersTurn } from "hooks/usePlayersTurn";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { notify } from "utils/notifications";
import useGameStore from "stores/useGameStore";
import Board from "components/Board";

const Game: NextPage = () => {
  const { publicKey } = useWallet();
  const { gameId: routerGameId } = useRouter().query;
  const program = useAnchorProgram();
  const [gameId, gameState, connectToGame, currentPlayerIdx] = useGameStore(
    (s) => [s.gameId, s.gameState, s.connectToGame, s.currentPlayerIdx]
  );
  useEffect(() => {
    // We don't need to check for publicKey as
    // program needs publicKey to be defined
    if (program && routerGameId !== gameId) {
      connectToGame(routerGameId as string, program, publicKey).then(() =>
        notify({
          type: "info",
          message: "Connected to game!",
        })
      );
    }
  }, [routerGameId, gameId]);

  // CurrentPlayerIdx is null if the user is not a player in the game
  if (currentPlayerIdx === null) return <div> Not your Game </div>;
  // If there is no gameState it means the game is loading currently!
  if (!gameState) return <div>Loading...</div>;

  // Actual board and turn info
  const playersTurn = usePlayersTurn(gameState.turn, currentPlayerIdx);
  const gameStatus = useGameStatus(gameState.state as any, publicKey);
  const board = useBoard(gameState.board as any);

  return (
    <div className="text-center">
      <div className="my-10 text-3xl">Game Id: {gameId}</div>
      <div className="my-5 text-3xl">
        Your Sign: {currentPlayerIdx === 0 ? "X" : "O"}
      </div>
      <div className="my-5 text-3xl">
        {playersTurn ? (
          <div className="text-green-600">Your turn</div>
        ) : (
          <div className="text-red-600">Not your turn</div>
        )}
      </div>
      <Board board={board} />
      <div className="text-2xl my-2 text-blue-600">
        <GameState status={gameStatus} />
      </div>
    </div>
  );
};

export default Game;
