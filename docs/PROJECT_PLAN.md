# Project Plan: Arc Raiders TTK Calculator

## Overview
This project is a high-performance, static web application designed to calculate Time-to-Kill (TTK) statistics for the game *Arc Raiders*. It is architected for **zero-cost hosting**, **high scalability**, and **future monetization**.

## Architecture

### Usage & Hosting
*   **Platform**: [Cloudflare Pages](https://pages.cloudflare.com/) (Free Tier).
    *   **Reasoning**: Unlimited bandwidth, massive global edge network, commercial use allowed.
*   **Domain**: Custom domain (to be configured).
*   **Cost Model**: $0/month (Static assets).

### Technical Stack
*   **Framework**: **React** (v18+) with **TypeScript**.
    *   *Why*: Type safety for complex gun data, rich ecosystem for UI components.
*   **Build Tool**: **Vite**.
    *   *Why*: Extremely fast builds, optimized for static output, easy integration with Cloudflare.
*   **Styling**: **Tailwind CSS**.
    *   *Why*: Rapid development, small CSS bundle size, consistent design system.
*   **Data Storage**: **Static JSON**.
    *   *Why*: Data updates are infrequent (monthly). Bundling data into the app guarantees 0ms lookup latency and 0 database costs.

### Data Flow
1.  **Source of Truth**: `src/data/guns.json` contains raw stats (damage, fire rate, recoil).
2.  **Calculation**: Javascript logic runs in the user's browser (Client-Side).
    *   Input: Weapon + Target Armor + Range.
    *   Process: Math formulas.
    *   Output: TTK (Seconds), DPS, Shots to Kill.
3.  **Visualization**: React components render charts/bars instantly.

## Future Roadmap (Backend Expansion)
When the app requires user accounts or saved loadouts, we will expand without rewriting:
*   **Backend**: Cloudflare Workers (Serverless Functions) added to `/functions`.
*   **Database**: Supabase (PostgreSQL) or Cloudflare D1 (SQLite) for user data.

## Monetization Strategy
*   **AdSense**: Compatible with Cloudflare Pages policy.
*   **Affiliate Links**: Hardware/Gaming peripherals referrals.
