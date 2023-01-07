use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

use crate::*;

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct Tile {
    row: u8,
    column: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub enum GameState {
    GameCreated,
    Active,
    Tie,
    Won { winner: Pubkey },
}

#[derive(
    AnchorSerialize, AnchorDeserialize, ToPrimitive, FromPrimitive, Clone, Copy, PartialEq, Eq,
)]
pub enum Sign {
    X,
    O,
}

#[account]
pub struct Game {
    pub players: [Option<Pubkey>; 2],
    pub turn: u8,
    pub board: [[Option<Sign>; 3]; 3],
    pub state: GameState,
    pub game_id: String,
    pub bump: u8,
}

impl Game {
    // (32 * 2) + 1 => Players | 1 => Turn | (9 + 1) => Board |
    // 32 + 1 => State | 32 => Game ID | 1 => Bump
    pub const MAXIMUM_SIZE: usize = ((32 * 2) + 1) + 1 + (9 + 1) + (32 + 1) + 32 + 1;

    pub fn create(&mut self, player_one: Pubkey, game_id: String) -> Result<()> {
        require_eq!(self.turn, 0, TicTacToeError::GameAlreadyStarted);
        self.players = [Some(player_one), None];
        self.game_id = game_id;
        self.state = GameState::GameCreated;
        Ok(())
    }

    pub fn join(&mut self, player_two: Pubkey) -> Result<()> {
        // Check if player two is already in the game
        require!(
            !self.player_two_joined(),
            TicTacToeError::PlayerTwoAlreadySet
        );
        self.players[1] = Some(player_two);
        self.state = GameState::Active;
        self.turn = 1;
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        self.state == GameState::Active
    }

    pub fn player_two_joined(&self) -> bool {
        self.players[1].is_some()
    }

    pub fn game_is_ready(&self) -> Result<()> {
        require!(self.player_two_joined(), TicTacToeError::PlayerTwoNotSet);
        require!(self.is_active(), TicTacToeError::GameAlreadyEnded);
        Ok(())
    }

    pub fn current_player_idx(&self) -> usize {
        ((self.turn - 1) % 2) as usize
    }

    pub fn current_player(&self) -> Pubkey {
        let player = self.players[self.current_player_idx()];
        // Unwrapping as there is gurantee of player being present
        // as the game is active, and game can only be active after
        // player two is set.
        player.unwrap()
    }

    pub fn play(&mut self, tile: &Tile) -> Result<()> {
        self.game_is_ready()?;

        require!(
            tile.row < 3 && tile.column < 3,
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

    pub fn is_winning_trio(&self, trio: [(usize, usize); 3]) -> bool {
        let [first, second, third] = trio;
        self.board[first.0][first.1].is_some()
            && self.board[first.0][first.1] == self.board[second.0][second.1]
            && self.board[second.0][second.1] == self.board[third.0][third.1]
    }

    pub fn update_state(&mut self) {
        // For three of same row or column
        for i in 0..3 {
            if self.is_winning_trio([(i, 0), (i, 1), (i, 2)])
                || self.is_winning_trio([(0, i), (1, i), (2, i)])
            {
                self.state = GameState::Won {
                    winner: self.current_player(),
                };
            }
        }

        // For diagnals
        if self.is_winning_trio([(0, 0), (1, 1), (2, 2)])
            || self.is_winning_trio([(0, 2), (1, 1), (2, 0)])
        {
            self.state = GameState::Won {
                winner: self.current_player(),
            };
            return;
        }

        // Reaching here means the game hasn't been won.
        // That means either it's a draw or there are tiles
        // left to be filled.
        for row in 0..3 {
            for column in 0..3 {
                if self.board[row][column].is_none() {
                    return;
                }
            }
        }

        // If there are no empty tiles left then it's a tie
        self.state = GameState::Tie;
    }
}
