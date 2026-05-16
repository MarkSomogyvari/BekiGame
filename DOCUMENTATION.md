# BekiGame User Documentation

BekiGame is a digital serious game designed for river basin decision-making stakeholders. It facilitates collaboration and conflict resolution between government entities and local communities under environmental uncertainty.

## Getting Started

1.  **Run the App:**
    ```bash
    cd webapp
    npm install
    npm run dev -- --port 3002
    ```
2.  **Access:** Open [http://localhost:3002/](http://localhost:3002/) in your browser.
3.  **Role Selection:** Choose a role to enter the interface. You can switch roles at any time using the "Switch Role" button in the header.

---

## Role Guides

### 1. Game Master (The Facilitator)
The Game Master controls the flow and environmental conditions of the game.
*   **Phase Control:** Advance the game through its 6 phases (Introduction → Proposal → Exchange → Revision → Presentation → Evaluation).
*   **Drawing Cards:** Trigger environmental changes by drawing **Season**, **Extreme Event**, or **Uncertainty** cards. These updates are reflected live on all other participants' screens.
*   **Reset:** Use the "Reset Game" button to clear all state and start over.

### 2. Teams (Decision Maker & Community)
These are the primary players.
*   **Proposal Drafting:** During "Proposal Creation" and "Revision", use the main text area to draft your strategy.
*   **Power Cards:** Click "Request Expert Consultation" to seek advice. Each team has a limit of **4 Power Cards**.
*   **Exchange Phase:** View the other team's proposal and provide feedback via comments.
*   **Breaking News:** Monitor the top of the screen for live alerts from the Media Bureau.

### 3. Expert (The Power Room)
Experts provide technical and social guidance.
*   **Active Consultations:** When a team uses a Power Card, their draft becomes visible in your interface.
*   **Guidance:** Communicate with the team (verbally or via comments) and click "Complete Consultation" when finished.

### 4. Media Bureau (The Information Hub)
Media ensures information transparency.
*   **Broadcasting:** Type news alerts (e.g., "Flood warning in Zone B") and click "Broadcast Message".
*   **Global Alerts:** Your broadcasts appear as a high-visibility banner for all other roles.

### 5. Observer (The Monitor)
Observers track the game progress without interfering.
*   **Live View:** Monitor both teams' proposals side-by-side.
*   **Scenario Tracking:** See exactly which cards the Game Master has drawn.

---

## Technical Details

*   **State Management:** Managed via a custom React hook `useGameState.ts`.
*   **Persistence:** Game state is saved to `localStorage`, so refreshing the page will not lose progress.
*   **Styling:** Native CSS with a river-basin themed color palette defined in `theme.css`.
*   **Checkpoint:** The current version is saved in the local Git repository as "Initial commit".
