import create, { State } from "zustand";
import { PublicKey } from "@solana/web3.js";
import { Program, utils } from "@project-serum/anchor";
import { TicTacToe } from "models/tictactoe";
import { GameState } from "models/types";

interface GameStore extends State {
  gamePDA?: PublicKey;
  gameId?: string;
  subscribed: boolean;
  gameState?: GameState;
  currentPlayerIdx?: number;
  createGame: (
    program: Program<TicTacToe>,
    publicKey: PublicKey,
    gameId?: string
  ) => Promise<void>;
  joinGame: (
    gameId: string,
    program: Program<TicTacToe>,
    publicKey: PublicKey
  ) => Promise<void>;
  makeMove: (
    tile: { row: number; column: number },
    program: Program<TicTacToe>
  ) => Promise<void>;
  connectToGame: (
    gameId: string,
    program: Program<TicTacToe>,
    publicKey: PublicKey
  ) => Promise<void>;
  startEventListener: (program: Program<TicTacToe>) => Promise<void>;
  removeEventListener: (program: Program<TicTacToe>) => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  subscribed: false,
  createGame: async (program, publicKey, gameId) => {
    get().removeEventListener(program);

    if (!gameId) {
      gameId = Math.random().toString(36).substring(2, 15);
    }
    const [gamePDA, _nonce] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("game"), utils.bytes.utf8.encode(gameId)],
      program.programId
    );

    await program.methods
      .create(gameId)
      .accounts({ game: gamePDA, playerOne: publicKey })
      .rpc();
    set((s) => {
      s.gameId = gameId;
      s.gamePDA = gamePDA;
      s.currentPlayerIdx = 0;
    });

    // Set event listener
    get().startEventListener(program);
  },

  joinGame: async (gameId, program, publicKey) => {
    get().removeEventListener(program);

    const [gamePDA, _nonce] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("game"), utils.bytes.utf8.encode(gameId)],
      program.programId
    );

    await program.methods
      .join()
      .accounts({ game: gamePDA, player: publicKey })
      .rpc();

    set((s) => {
      s.gameId = gameId;
      s.gamePDA = gamePDA;
      s.currentPlayerIdx = 1;
    });

    // Set event listener
    get().startEventListener(program);
  },

  connectToGame: async (gameId, program, publicKey) => {
    // Clearing the state before connecting to a new game
    get().removeEventListener(program);

    const [gamePDA, _nonce] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("game"), utils.bytes.utf8.encode(gameId)],
      program.programId
    );
    set((s) => {
      (s.gameId = gameId), (s.gamePDA = gamePDA);
    });

    // Adding event listener and updating the gameState
    await get().startEventListener(program);
    // Fetching the current player index
    const players = get().gameState.players;
    // Updating the current player idx
    let currentPlayerIdx: number = null;
    if (players[0] !== null && players[0].equals(publicKey)) {
      console.log(players);
      currentPlayerIdx = 0;
    } else if (players[1] !== null && players[1].equals(publicKey)) {
      currentPlayerIdx = 1;
    }

    if (!(currentPlayerIdx !== null)) {
      set((s) => {
        s.gameState = null;
        s.gameId = null;
        s.gamePDA = null;
        s.currentPlayerIdx = currentPlayerIdx;
      });
    } else {
      set((s) => {
        s.currentPlayerIdx = currentPlayerIdx;
      });
    }
  },

  makeMove: async ({ row, column }, program) => {
    if (!program) {
      throw new Error("Wallet not connected!");
    }
    const gamePDA = get().gamePDA;
    await program.methods
      .play({ row, column })
      .accounts({ game: gamePDA })
      .rpc();
  },
  removeEventListener: (program) => {
    if (get().subscribed) {
      program.account.game.unsubscribe(get().gamePDA);
    }
    set((s) => {
      s.subscribed = false;
    });
  },
  startEventListener: async (program) => {
    program.account.game
      .subscribe(get().gamePDA)
      .addListener("change", (data: GameState) => {
        set((s) => {
          s.gameState = data;
        });
      });

    const gameState = await program.account.game.fetch(get().gamePDA);
    set((s) => {
      s.gameState = gameState;
      s.subscribed = true;
    });
  },
}));

export default useGameStore;
