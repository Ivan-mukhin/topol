# Step-by-Step Implementation Guide

Follow these steps to initialize, build, and deploy the Arc Raiders TTK Calculator.

## Phase 1: Initialization

### 1. Prerequisite Check
Ensure you have Node.js installed:
```bash
node -v
# Should be v18 or newer
```

### 2. Scaffold Project
We use Vite to create a lightweight React + TypeScript project.
```bash
# Run in the repository root
npx -y create-vite@latest . --template react-ts
# Note: The current directory must be empty or contain only non-conflicting files.
# We have already successfully moved legacy python scripts to 'python_prototype/'.

npm install
```

### 3. Install Dependencies
Install Tailwind CSS for styling and other utilities.
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
*   Update `tailwind.config.js` to scan your files:
    ```js
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
*   Add directives to `src/index.css`:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

## Phase 2: Core Development

### 1. Data Layer Implementation
*   Create `src/data/` directory.
*   Create `vectors.ts` (Types) and `guns.json` (Data).
*   Port the logic from `python_prototype/ttk_calculator.py` into TypeScript functions.

### 2. Component Construction
*   **WeaponSelector**: Dropdown to pick guns.
*   **DamageChart**: Visual representation of TTK.
*   **LoadoutConfig**: Toggles for armor/upgrades.

## Phase 3: Deployment

### 1. Local Testing
```bash
npm run dev
# Open http://localhost:5173
```

### 2. Cloudflare Deployment
1.  Log in to Cloudflare Dashboard.
2.  Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3.  Select this repository.
4.  **Build Settings**:
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  Click **Save and Deploy**.

## Maintenance
*   **Update Stats**: Edit `src/data/guns.json` and push to `main`. Cloudflare auto-deploys within seconds.
