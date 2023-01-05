import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { config, expect } from "chai";
import { TicTacToe } from "../target/types/tic_tac_toe";

describe("tic-tac-toe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

  // Get userStatsPda
  function getGamePDA(): [string, PublicKey] {
    const gameId = Math.random().toString(36).substring(2, 7);
    const [pda, _nonce] = PublicKey.findProgramAddressSync(
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
    let [gameId, gamePDA] = getGamePDA();

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
    let [gameId, gamePDA] = getGamePDA();

    before(async () => {
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

  describe("test game win", () => {
    let playerOne = (program.provider as anchor.AnchorProvider).wallet;
    let playerTwo = anchor.web3.Keypair.generate();
    let gamePDA: PublicKey;
    let gameId: string;

    beforeEach(async () => {
      [gameId, gamePDA] = getGamePDA();

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

    it("player two wins diagnal", async () => {
      await program.methods
        .play({ row: 0, column: 0 })
        .accounts({ game: gamePDA, player: playerOne.publicKey })
        .rpc();

      await program.methods
        .play({ row: 0, column: 2 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 0, column: 1 })
        .accounts({ game: gamePDA })
        .rpc();

      await program.methods
        .play({ row: 1, column: 1 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 1, column: 2 })
        .accounts({ game: gamePDA })
        .rpc();

      await program.methods
        .play({ row: 2, column: 0 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      let gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.state).to.deep.equal({
        won: { winner: playerTwo.publicKey },
      });
      expect(gameState.board).to.deep.equal([
        [{ x: {} }, { x: {} }, { o: {} }],
        [null, { o: {} }, { x: {} }],
        [{ o: {} }, null, null],
      ]);
    });

    it("player one wins straight", async () => {
      await program.methods
        .play({ row: 1, column: 0 })
        .accounts({ game: gamePDA, player: playerOne.publicKey })
        .rpc();

      await program.methods
        .play({ row: 0, column: 0 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 1, column: 1 })
        .accounts({ game: gamePDA })
        .rpc();

      await program.methods
        .play({ row: 0, column: 2 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 1, column: 2 })
        .accounts({ game: gamePDA })
        .rpc();

      let gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.state).to.deep.equal({
        won: { winner: playerOne.publicKey },
      });
      expect(gameState.board).to.deep.equal([
        [{ o: {} }, null, { o: {} }],
        [{ x: {} }, { x: {} }, { x: {} }],
        [null, null, null],
      ]);
    });

    it("draw", async () => {
      await program.methods
        .play({ row: 0, column: 0 })
        .accounts({ game: gamePDA, player: playerOne.publicKey })
        .rpc();

      await program.methods
        .play({ row: 0, column: 1 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 0, column: 2 })
        .accounts({ game: gamePDA })
        .rpc();

      await program.methods
        .play({ row: 1, column: 0 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 1, column: 1 })
        .accounts({ game: gamePDA })
        .rpc();

      await program.methods
        .play({ row: 2, column: 2 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 1, column: 2 })
        .accounts({ game: gamePDA })
        .rpc();

      await program.methods
        .play({ row: 2, column: 0 })
        .accounts({ game: gamePDA, player: playerTwo.publicKey })
        .signers([playerTwo])
        .rpc();

      await program.methods
        .play({ row: 2, column: 1 })
        .accounts({ game: gamePDA })
        .rpc();

      let gameState = await program.account.game.fetch(gamePDA);
      expect(gameState.state).to.deep.equal({
        tie: {},
      });
      expect(gameState.board).to.deep.equal([
        [{ x: {} }, { o: {} }, { x: {} }],
        [{ o: {} }, { x: {} }, { x: {} }],
        [{ o: {} }, { x: {} }, { o: {} }],
      ]);
    });
  });
});
