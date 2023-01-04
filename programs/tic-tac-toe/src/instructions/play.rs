use anchor_lang::prelude::*;

use crate::*;

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(
        mut,
        seeds = [b"game", game.game_id.as_bytes()],
        bump = game.bump,
    )]
    pub game: Account<'info, Game>,

    pub player: Signer<'info>,
}

pub fn handler(ctx: Context<Play>, tile: Tile) -> Result<()> {
    msg!("Play tile {:?}", tile);

    let game = &mut ctx.accounts.game;

    require_keys_eq!(
        game.current_player(),
        ctx.accounts.player.key(),
        TicTacToeError::NotPlayersTurn
    );

    game.play(&tile)?;

    Ok(())
}
