type Sign = { x: {} } | { o: {} } | null;

const signX = JSON.stringify({ x: {} });
const signO = JSON.stringify({ o: {} });

export function useBoard(board: Sign[][]) {
  const tempBoard = board.map((arr) =>
    arr
      .map((sign) => JSON.stringify(sign))
      .map((strSign) =>
        strSign === signX ? "X" : strSign === signO ? "O" : " "
      )
  );
  return tempBoard;
}
