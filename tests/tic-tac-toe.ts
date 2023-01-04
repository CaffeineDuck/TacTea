import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { TicTacToe } from "../target/types/tic_tac_toe";

describe("tic-tac-toe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

  // Get userStatsPda
  async function getGamePDA(): Promise<[string, PublicKey]> {
    const gameId = Math.random().toString(36).substring(2, 7);
    const [pda, _nonce] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("game"),
        anchor.utils.bytes.utf8.encode(gameId),
      ],
      program.programId
    );
    return [gameId, pda];
  }

  describe("initization", async () => {
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    let gamePDA: PublicKey;
    let gameId: string;

    before(async () => {
      [gameId, gamePDA] = await getGamePDA();
    });

    it("game id creation", async () => {
      await program.methods
        .create(gameId)
        .accounts({
          game: gamePDA,
          playerOne: playerOne.publicKey,
        })
        .rpc();

      const gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.turn).to.equal(0);
      expect(gameState.gameId).to.equal(gameId);
      expect(gameState.state).to.deep.equal({ gameCreated: {} });
      expect(gameState.board).to.deep.equal([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
    });

    it("join game id", async () => {
      const playerTwo = anchor.web3.Keypair.generate();
      await program.methods
        .join()
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      const gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.players).to.deep.include(playerTwo.publicKey);
      expect(gameState.state).to.deep.equal({ active: {} });
    });
  });

  describe("test single game", async () => {
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();

    let gamePDA: PublicKey;
    let gameId: string;

    before(async () => {
      [gameId, gamePDA] = await getGamePDA();

      await program.methods
        .create(gameId)
        .accounts({
          game: gamePDA,
          playerOne: playerOne.publicKey,
        })
        .rpc();
      await program.methods
        .join()
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();
    });

    it("player one moves", async () => {
      await program.methods
        .play({ row: 0, column: 0 })
        .accounts({ game: gamePDA, player: playerOne.publicKey })
        .rpc();

      let gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.turn).to.equal(2);
      expect(gameState.board).to.deep.equal([
        [{ x: {} }, null, null],
        [null, null, null],
        [null, null, null],
      ]);
    });

    it("player two moves", async () => {
      await program.methods
        .play({ row: 0, column: 1 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      let gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.turn).to.equal(3);
      expect(gameState.board).to.deep.equal([
        [{ x: {} }, { o: {} }, null],
        [null, null, null],
        [null, null, null],
      ]);
    });
  });
});
