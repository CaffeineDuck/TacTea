import { GameStatus } from "hooks/useGameStatus";

interface Props {
  status: GameStatus;
}

export function GameState({ status }: Props) {
  return (
    <>
      {status === GameStatus.WaitingForPlayerTwo && (
        <div>Waiting for player 2</div>
      )}
      {status === GameStatus.Playing && <div>Playing</div>}
      {status === GameStatus.Won && <div>You won!</div>}
      {status === GameStatus.Lost && <div>You lost!</div>}
      {status === GameStatus.Tie && <div>Tie!</div>}
    </>
  );
}
