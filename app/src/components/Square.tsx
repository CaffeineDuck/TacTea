interface Props {
  value: "X" | "O" | " ";
  row: number;
  column: number;
  canClick: boolean;
  isLoading: boolean;
  handleClick: (row: number, column: number) => void;
}

function Square({
  value,
  row,
  column,
  canClick,
  isLoading,
  handleClick,
}: Props) {
  const color = value === "X" ? "text-green-500" : "text-red-500";
  return (
    <button
      className={`btn h-24 border-solid border-2 border-black
        text-center flex justify-center align-middle cursor-pointer
        ${isLoading && "loading"}`}
      onClick={() => canClick && handleClick(row, column)}
      disabled={!canClick || value !== " "}
    >
      <span
        className={`${color} font-extrabold flex items-center justify-center text-3xl`}
      >
        {value}
      </span>
    </button>
  );
}

export default Square;
