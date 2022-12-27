use anchor_lang::prelude::*;

pub fn play(&mut self, tile: &Tile) -> Result<()> {
    require!(self.is_active(), TicTacToeError::GameAlreadyOver);
    require!(
        tile.row <= 3 && tile.column <= 3,
        TicTacToeError::TileOutOfBounds
    );

    let current_tile = &self.board[tile.row as usize][tile.column as usize];
    require!(current_tile.is_none(), TicTacToeError::TileAlreadyPopulated);

    self.board[tile.row as usize][tile.column as usize] =
        Some(Sign::from_usize(self.current_player_idx()).unwrap());

    self.update_state();

    if self.state == GameState::Active {
        self.turn += 1;
    }

    Ok(())
}
