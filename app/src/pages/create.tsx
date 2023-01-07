import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProgram } from "hooks/useAnchorProgram";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGameStore from "stores/useGameStore";
import { notify } from "utils/notifications";

const Create: NextPage = () => {
  const [createGame, gameId] = useGameStore((s) => [s.createGame, s.gameId]);
  const [loading, setLoading] = useState<"NOT_STARTED" | "LOADING" | "CREATED">(
    "NOT_STARTED"
  );
  const { publicKey } = useWallet();
  const program = useAnchorProgram();

  const handleClick = async () => {
    if (!program) notify({ type: "error", message: "Wallet not connected" });

    setLoading("LOADING");
    notify({ type: "info", message: "Game is being created, please wait!" });

    try {
      await createGame(program, publicKey);
      setLoading("CREATED");
    } catch (error) {
      notify({ type: "error", message: error.message });
    }
  };

  useEffect(() => {
    if (!gameId) return;
    notify({ type: "success", message: `Game created with id ${gameId}` });
  }, [gameId]);

  return (
    <div className="my-80">
      <Head>
        <title>Create Game - TacTea</title>
        <meta name="description" content="Create TacTie game" />
      </Head>
      <div className="flex flex-col justify-center items-center my-10">
        <div className="text-center font-mono text-4xl py-10">
          {gameId ? "Game Id: " + gameId : "Game Not Created Yet"}
        </div>
        <button
          className={"btn btn-lg " + (loading === "LOADING" ? "loading" : "")}
          disabled={loading !== "NOT_STARTED"}
          onClick={handleClick}
        >
          {loading === "CREATED" ? "Game Created" : "Create Game"}
        </button>
        {gameId && (
          <button className="btn btn-wide btn-link my-5">
            <Link href={`/game/${gameId}`}>Goto The Game</Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default Create;
