# Agent History Persistence Workflow

To ensure that the development history and decision-making process are preserved for future sessions and for the user's reference, all agents should follow this workflow:

## 1. Directory Structure
All history is stored in `.agents/history/`:
- `plans/`: Stores `.md` files of implementation plans.
- `walkthroughs/`: Stores `.md` files of session walkthroughs.
- `history_log.md`: The master log summarizing all major milestones.

## 2. Naming Convention
Use the date and a short descriptive name:
- `YYYY-MM-DD_feature_name.md`

## 3. End-of-Session Procedure
Before concluding a major task (i.e., before calling `notify_user` for the final time), the agent MUST:
1.  **Export Implementation Plan**: Copy the final version of the `implementation_plan.md` artifact to `.agents/history/plans/YYYY-MM-DD_description.md`.
2.  **Export Walkthrough**: Once the walkthrough is generated and verified, copy it to `.agents/history/walkthroughs/YYYY-MM-DD_description.md`.
3.  **Update Master Log**: Add a new entry to `history_log.md` with:
    - Date
    - Objective
    - Key Changes (bullet points)
    - Links to the exported documents.

## 4. Why this matters
The ephemeral nature of agent memory means that without these files, subsequent sessions start with a "blank slate" regarding current progress and rationale. Keeping these documents in the repo creates a durable memory for the project.
