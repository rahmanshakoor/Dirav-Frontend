# Dirav MVP Prototype - Setup Instructions

## Troubleshooting NPM Permissions
During setup, we encountered `EACCES` (permission denied) errors with your npm cache. This is a common issue on Macs when npm was previously used with `sudo`.

To fix this and run the project, please open your terminal and run:

```bash
sudo chown -R 501:20 ~/.npm
```
*(Enter your password when prompted. It will not show on screen)*

## Running the Project
Once permissions are fixed, you can install the dependencies and start the app:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. Open the link shown (usually `http://localhost:5173`) in your browser.

## Project Structure
- `src/components/`: Reusable UI components (Sidebar, Layout).
- `src/pages/`: Main application pages (Dashboard, Planning, Savings, etc.).
- `src/context/`: State management (mock financial data).
- `src/index.css`: Global styles and design system.
