use anchor_lang::prelude::*;

use crate::*;

#[derive(Accounts)]
#[instruction(game_id: String)]
pub struct Create<'info> {
    #[account(
        init,
        payer=player_one,
        seeds=[b"game", game_id.as_bytes()],
        bump,
        space=Game::MAXIMUM_SIZE + 8 + game_id.len()
    )]
    pub game: Account<'info, Game>,

    #[account(mut)]
    pub player_one: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Create>, game_id: String) -> Result<()> {
    let game = &mut ctx.accounts.game;
    game.create(ctx.accounts.player_one.key(), game_id)?;
    game.bump = *ctx.bumps.get("game").unwrap();
    Ok(())
}
