export function usePlayersTurn(turn: number, currentPlayerIdx: number) {
  return turn % 2 !== currentPlayerIdx;
}
