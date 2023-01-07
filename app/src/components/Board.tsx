import { useAnchorProgram } from "hooks/useAnchorProgram";
import { usePlayersTurn } from "hooks/usePlayersTurn";
import { useState } from "react";
import useGameStore from "stores/useGameStore";
import { notify } from "utils/notifications";
import Square from "./Square";

type Sign = "X" | "O" | " ";

interface BoardProps {
  board: Sign[][];
}

export default function Board({ board }: BoardProps) {
  const program = useAnchorProgram();
  if (!program) return <>Loading...</>;

  const [loading, setLoading] = useState(false);
  const [makeMove, gameState, currentPlayerIdx] = useGameStore((s) => [
    s.makeMove,
    s.gameState,
    s.currentPlayerIdx,
  ]);
  const isMyTurn = usePlayersTurn(gameState.turn, currentPlayerIdx);

  const handleClick = async (row: number, column: number) => {
    notify({ type: "info", message: "Making move..." });
    setLoading(true);
    try {
      await makeMove(
        {
          row,
          column,
        },
        program
      );
      notify({ type: "success", message: "Move made!" });
    } catch (e) {
      notify({
        type: "error",
        message: "Move failed!",
        description: e.message,
      });
    }
    setLoading(false);
  };
  return (
    <>
      {board.map((arr, row) => (
        <div className="grid gap-x-1 gap-y-1 grid-cols-3 mx-auto max-w-sm">
          {arr.map((sign, col) => (
            <Square
              value={sign}
              row={row}
              column={col}
              handleClick={handleClick}
              canClick={!loading && isMyTurn}
              isLoading={loading}
            />
          ))}
        </div>
      ))}
    </>
  );
}
