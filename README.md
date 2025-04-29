# Pokémon Browser

A simple React application that fetches data from the [PokeAPI](https://pokeapi.co/) and allows users to search and filter the first 150 Pokémon.

## 🌟 Features

- 🔍 **Search** Pokémon by name in real time
- 🎯 **Filter** Pokémon by type (e.g., Fire, Water, Grass)
- 🧾 View each Pokémon's:
  - Name
  - Image (sprite)
  - ID number
  - Type(s)
- 📱 Fully responsive on mobile and desktop
- ⚠️ Handles loading states, empty results, and API errors

---

## 🔧 Technologies Used

- **React 19**
- **Vite** – for fast build and dev server
- **Tailwind CSS** – for styling
- **PokeAPI** – for Pokémon data

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pokemon-browser.git
cd pokemon-browser
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run start
```

This will run both Vite dev server and Tailwind CSS in watch mode.

---

## 🧱 Project Structure

```
pokemon-browser/
├── public/
├── components/
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── PokemonList.jsx
│   └── PokemonCard.jsx
├── App.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🛠 Build for Production

```bash
npm run build
```

Vite will output files to the `dist/` directory.

---

## 🌐 Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your GitHub repo
4. Set these Vercel settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**

---

## 📦 Scripts Overview

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "tailwind": "postcss ./styles.css -o ./output.css --watch",
  "start": "concurrently \"npm run dev\" \"npm run tailwind\""
}
```

---

## 💡 Future Improvements

- Pagination or lazy loading
- More filtering options (e.g. by ability, stats)
- Detailed Pokémon modal on click

---

## 📝 License

MIT © [Shashank Gupta](https://github.com/Shashankg27)