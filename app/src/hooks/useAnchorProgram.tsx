import { AnchorProvider, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { TicTacToe } from "../models/tictactoe";
import { useMemo } from "react";
import idl from "../idl.json";

export function useAnchorProgram() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  return useMemo(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(connection, anchorWallet, {
        preflightCommitment: "confirmed",
        commitment: "processed",
      });
      console.log(AnchorProvider.defaultOptions());
      const program = new Program<TicTacToe>(
        idl as any,
        "HTjZ3QP4pN6PEVmuSvZgBDYEnsr57srsAzGjB1L8AkYN",
        provider
      );
      return program;
    }
  }, [connection, anchorWallet]);
}
