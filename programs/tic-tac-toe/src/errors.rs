use anchor_lang::prelude::*;

#[error_code]
pub enum TicTacToeError {
    PlayerTwoNotSet,
    PlayerTwoAlreadySet,
    GameNotCreated,
    GameAlreadyStarted,
    GameAlreadyEnded,
    TileAlreadyPopulated,
    TileOutOfBounds,
    NotPlayersTurn,
    PlayerOneCannotJoin,
}
