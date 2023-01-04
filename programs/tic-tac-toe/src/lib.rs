#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use errors::*;
use instructions::*;
use state::*;

declare_id!("6t7apAJrPmkCQoGjqzWM6ZjicUNnjdz5qJ6ob1jjBz1E");

#[program]
pub mod tic_tac_toe {
    use super::*;

    pub fn create(ctx: Context<Create>, game_id: String) -> Result<()> {
        instructions::create::handler(ctx, game_id)
    }

    pub fn join(ctx: Context<Join>) -> Result<()> {
        instructions::join::handler(ctx)
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        instructions::play::handler(ctx, tile)
    }
}
