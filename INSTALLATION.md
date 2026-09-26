# React + Vite Project — Installation Guide

## 1. Requirements

Before installing the project, make sure these are installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Git

Check the installed versions:

```bash
node -v
npm -v
git --version
```

## 2. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/uzairuddinansari/techwiz-fandom-verse.git
```

Move into the project folder:

```bash
cd techwiz-fandom-verse
```

## 3. Install Dependencies

Install all required packages:

```bash
npm install
```

## 4. Environment Variables

If the project uses environment variables, create a `.env` file in the project root.

Example:

```env
VITE_GROQ_API_KEY=
```

For Vite, client-side environment variables must start with `VITE_`.

Do not upload `.env` files containing private keys or secrets to GitHub.

## 5. Run the Development Server

Start the project with:

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

## 6. Build for Production

To create a production build:

```bash
npm run build
```

The production files will be generated inside the:

```text
dist/
```

folder.

## 7. Preview the Production Build

To preview the production build locally:

```bash
npm run preview
```

## 8. Common Commands

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint, if configured |

## 9. Vercel Deployment

For deployment on Vercel:

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Vercel should detect the Vite project automatically.
5. Add required environment variables in Vercel Project Settings.
6. Deploy the project.

For React Router projects using client-side routes, add a `vercel.json` file in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This allows routes such as `/anime`, `/gaming`, or `/profile` to work correctly after refreshing the page.

## 10. Project Structure

A typical React + Vite project looks like:

```text
project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 11. Troubleshooting

### `npm install` fails

Try:

```bash
npm cache clean --force
npm install
```

If the problem continues, delete `node_modules` and `package-lock.json`, then run:

```bash
npm install
```

### `npm run dev` is not recognized

Make sure Node.js is installed correctly:

```bash
node -v
npm -v
```

Then restart your terminal.

### Page shows 404 after refreshing a route on Vercel

Make sure `vercel.json` exists in the project root and contains the React Router rewrite configuration shown above.

## 12. Updating the Project

After making changes:

```bash
git add .
git commit -m "update project"
git push
```

If the repository is connected to Vercel, Vercel will automatically deploy the new changes.
