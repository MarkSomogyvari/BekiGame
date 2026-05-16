# BekiGame - River Basin Decision-Making Serious Game

A digital prototype of the BekiGame serious game, designed to help stakeholders understand decision-making in river basin management under uncertainty.

## Project Structure

- `original_documents/`: Contains the original rules and concept documents.
- `webapp/`: The React (TypeScript) frontend application.
  - `src/types/`: TypeScript interfaces for game models.
  - `src/constants/`: Game rules, phases, and card definitions.
  - `src/components/`: UI components for different game roles and views.
  - `src/styles/`: Theme and global styles.

## How to Run

1. Navigate to the `webapp` directory:
   ```bash
   cd webapp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Game Rules Summary

The game involves two main teams (Decision Makers and Community Members) interacting over several phases:
1. **Proposal Creation (20 min):** Adapting to a Season and an Extreme Event.
2. **Exchange (10 min):** Peer review and feedback.
3. **Revision (10 min):** Finalizing proposals based on feedback.
4. **Presentation & Evaluation:** Assessing impact based on ecological, social, and economic factors.

Expert consultation is available via **Power Cards** (limit 4 per team).
