use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, mint_to};
use std::collections::HashSet;

declare_id!("DvnnGA8jYNemr37MpXzNGtxQcCyLxyNLQv38FVJNF1Go");

#[program]
pub mod learn_proof_contract {
    use super::*;

    pub fn initialize_closed_course(
        ctx: Context<InitializeCourse>,
        participants: Vec<Pubkey>,
        end_date: i64,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course;
        course.instructor = ctx.accounts.instructor.key();
        course.participants = participants;
        course.end_date = end_date;
        course.claimed = vec![false; course.participants.len()];
        course.is_open = false;
        course.max_participants = course.participants.len() as u32;
        Ok(())
    }

    pub fn initialize_open_course(
        ctx: Context<InitializeCourse>,
        max_participants: u32,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course;
        course.instructor = ctx.accounts.instructor.key();
        course.participants = Vec::new();
        course.claimed = Vec::new();
        course.is_open = true;
        course.max_participants = max_participants;
        course.end_date = 0; 
        Ok(())
    }

    pub fn register_for_course(ctx: Context<RegisterForCourse>) -> Result<()> {
        let course = &mut ctx.accounts.course;
        
        require!(course.is_open, ErrorCode::CourseNotOpenForRegistration);
        require!(course.participants.len() < course.max_participants as usize, ErrorCode::CourseFull);
        require!(!course.participants.contains(&ctx.accounts.user.key()), ErrorCode::AlreadyRegistered);
        
        course.participants.push(ctx.accounts.user.key());
        course.claimed.push(false);
        
        Ok(())
    }

    pub fn start_course(ctx: Context<StartCourse>, end_date: i64) -> Result<()> {
        let course = &mut ctx.accounts.course;
        
        require!(course.is_open, ErrorCode::CourseNotOpen);
        require!(course.participants.len() > 0, ErrorCode::NoParticipants);
        require!(ctx.accounts.instructor.key() == course.instructor, ErrorCode::Unauthorized);
        
        course.is_open = false;
        course.end_date = end_date;
        
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

        let seeds = &[b"course", course.instructor.as_ref(), &[course.bump]];
        let signer = &[&seeds[..]];           // PDA подпишет CPI

        let cpi_ctx = CpiContext::new(
         ctx.accounts.token_program.to_account_info(),
         MintTo {
             mint: ctx.accounts.mint.to_account_info(),
             to: ctx.accounts.user_token_account.to_account_info(),
             authority: ctx.accounts.course.to_account_info(), // <‑‑ PDA
         },
            );

        mint_to(cpi_ctx.with_signer(signer), 1)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCourse<'info> {
    #[account(init, payer = instructor, space = 8 + Course::MAX_SIZE)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub instructor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterForCourse<'info> {
    #[account(mut)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct StartCourse<'info> {
    #[account(mut)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub instructor: Signer<'info>,
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
    pub is_open: bool,
    pub max_participants: u32,
}

impl Course {
    pub const MAX_SIZE: usize = 32 + 4 + (32 * 100) + 8 + 4 + (1 * 100) + 1 + 4; // 100
}

#[error_code]
pub enum ErrorCode {
    #[msg("Course is not finished yet")]
    CourseNotFinished,
    #[msg("Address is not a course participant")]
    NotParticipant,
    #[msg("NFT already claimed")]
    AlreadyClaimed,
    #[msg("Course is not open for registration")]
    CourseNotOpenForRegistration,
    #[msg("Course is full")]
    CourseFull,
    #[msg("Already registered for this course")]
    AlreadyRegistered,
    #[msg("Course is not open")]
    CourseNotOpen,
    #[msg("No participants registered")]
    NoParticipants,
    #[msg("Unauthorized")]
    Unauthorized,
}