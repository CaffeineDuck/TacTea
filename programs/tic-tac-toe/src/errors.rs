use anchor_lang::prelude::*;

#[error_code]
pub enum TicTacToeError {
    GameAlreadyStarted,
    GameAlreadyEnded,
    TileAlreadyPopulated,
    TileOutOfBounds,
    NotPlayersTurn,
}
