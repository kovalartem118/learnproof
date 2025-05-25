use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, mint_to};
declare_id!("DvnnGA8jYNemr37MpXzNGtxQcCyLxyNLQv38FVJNF1Go");

#[program]
pub mod learn_proof_contract {
    use super::*;

    pub fn initialize_course(
        ctx: Context<InitializeCourse>,
        participants: Vec<Pubkey>,
        end_date: i64,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course;
        course.instructor = ctx.accounts.instructor.key();
        course.participants = participants;
        course.end_date = end_date;
        course.claimed = vec![false; course.participants.len()];
        Ok(())
    }

    pub fn claim_nft(ctx: Context<ClaimNft>) -> Result<()> {
        let course = &mut ctx.accounts.course;
        let user = ctx.accounts.user.key();
        let clock = Clock::get()?;

        require!(clock.unix_timestamp > course.end_date, ErrorCode::CourseNotFinished);
        let index = course.participants.iter().position(|&p| p == user).ok_or(ErrorCode::NotParticipant)?;
        require!(!course.claimed[index], ErrorCode::AlreadyClaimed);

        course.claimed[index] = true;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.instructor.to_account_info(),
            },
        );

        mint_to(cpi_ctx.with_signer(&[]), 1)?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(participants: Vec<Pubkey>)]
pub struct InitializeCourse<'info> {
    #[account(init, payer = instructor, space = 8 + Course::MAX_SIZE)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub instructor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimNft<'info> {
    #[account(mut)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub instructor: Signer<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Course {
    pub instructor: Pubkey,
    pub participants: Vec<Pubkey>,
    pub end_date: i64,
    pub claimed: Vec<bool>,
}

impl Course {
    pub const MAX_SIZE: usize = 32 + 4 + (32 * 50) + 8 + 4 + (1 * 50); // max 50 
}

#[error_code]
pub enum ErrorCode {
    #[msg("Курс ще не завершено")] 
    CourseNotFinished,
    #[msg("Адреса не є учасником курсу")]
    NotParticipant,
    #[msg("NFT вже отримано")]
    AlreadyClaimed,
}
