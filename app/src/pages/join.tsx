import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProgram } from "hooks/useAnchorProgram";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import useGameStore from "stores/useGameStore";
import { notify } from "utils/notifications";

const Join: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<"NOT_STARTED" | "LOADING" | "CREATED">(
    "NOT_STARTED"
  );

  const { joinGame } = useGameStore();
  const gameId = useGameStore((s) => s.gameId);

  const { publicKey } = useWallet();
  const program = useAnchorProgram();

  const handleClick = async () => {
    if (!publicKey || !program)
      notify({ type: "error", message: "Wallet not connected" });

    const gameId = inputRef.current?.value;
    if (!gameId) notify({ type: "error", message: "Game id not provided" });

    setLoading("LOADING");
    try {
      await joinGame(gameId, program, publicKey);
      notify({ type: "success", message: `Game ${gameId} joined!` });
      setLoading("CREATED");
    } catch (error) {
      notify({ type: "error", message: error.message });
      setLoading("NOT_STARTED");
    }
  };

  return (
    <div>
      <Head>
        <title>Join Game - TicTacToe</title>
        <meta name="description" content="Join tictactoe game" />
      </Head>
      <div className="text-center my-10">
        <h1 className="text-3xl font-bold my-10">Join Game</h1>
        <input
          placeholder="Game Id"
          ref={inputRef}
          className="input input-lg input-bordered my-10 mx-5"
        />
        <button
          className={"btn btn-lg " + (loading === "LOADING" ? "loading" : "")}
          disabled={loading !== "NOT_STARTED"}
          onClick={handleClick}
        >
          {loading === "CREATED" ? "Joined Game" : "Join Game"}
        </button>
        <br />
        {gameId && (
          <button className="btn btn-wide btn-link my-5">
            <Link href={`/game/${gameId}`}>Goto The Game</Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default Join;
