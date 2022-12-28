use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

use crate::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Tile {
    row: u8,
    column: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub enum GameState {
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
    players: [Pubkey; 2],
    turn: u8,
    board: [[Option<Sign>; 3]; 3],
    state: GameState,
}

impl Game {
    pub const MAXIMUM_SIZE: usize = (32 * 2) + 1 + (9 * (1 + 1)) + (32 + 1);

    pub fn start(&mut self, players: [Pubkey; 2]) -> Result<()> {
        require_eq!(self.turn, 0, TicTacToeError::GameAlreadyStarted);
        self.players = players;
        self.turn = 1;
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        self.state == GameState::Active
    }

    pub fn current_player_idx(&self) -> usize {
        ((self.turn - 1) % 2) as usize
    }

    pub fn current_player(&self) -> Pubkey {
        self.players[self.current_player_idx()]
    }

    pub fn play(&mut self, tile: &Tile) -> Result<()> {
        require!(self.is_active(), TicTacToeError::GameAlreadyEnded);
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
