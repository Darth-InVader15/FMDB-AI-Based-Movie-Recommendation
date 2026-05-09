# Next Watch (FMDB AI-Based Movie Recommendation)

Next Watch is a dynamic, full-stack personal movie categorization and AI recommendation engine built with **Next.js**, **Tailwind CSS v4**, and **Framer Motion**. It allows users to search for movies/series, drag them into tailored categories, and receive highly personalized viewing recommendations powered by **Google Gemini AI**.

## 🚀 Features

- **Intuitive Categorization**: A clean, 4-column drag-and-drop board (Loved, Liked, Ok, Not for me) utilizing `@dnd-kit`.
- **Smart Search Integration**: Live search powered by the **TMDB API**, featuring debounced inputs (triggering at 3+ characters) and restricted suggestion results to keep the UI clean.
- **AI Recommendation Engine**: Generates 10 customized movie/TV show suggestions based on your specific categorizations using the **Google GenAI SDK (Gemini 2.5 Flash)**.
- **Modern UX/UI**: Fully redesigned with a deep black, Apple/Notion-inspired aesthetic.
  - Features full-page CSS scroll-snapping.
  - Utilizes horizontal carousels for rendering the AI recommendations.
  - Integrated `framer-motion` for smooth layout expansions and animations.
- **Local Persistence**: Automatically saves your board state directly into your browser's `localStorage` to preserve sessions.

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **APIs**: 
  - [TMDB API](https://developer.themoviedb.org/docs) (Movie fetching and poster images)
  - [Google Gemini API](https://ai.google.dev/) (Recommendation Engine)

## 📦 Getting Started

### Prerequisites

You will need valid API keys from TMDB and Google Gemini to run this project locally.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Darth-InVader15/FMDB-AI-Based-Movie-Recommendation.git
   cd FMDB-AI-Based-Movie-Recommendation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env.local` file in the root directory:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: If you run into an infinite reload loop on `localhost`, please ensure you have disabled any problematic Chrome Extensions (such as dark mode enforcers or dev tools) that might be stuck in a `setInterval` loop trying to access `chrome.storage.get`. Alternatively, use an Incognito window.

## 📝 Usage

1. Search for a movie or TV show using the floating search bar.
2. The searched item is added directly to your board. Drag it to the appropriate column (`Loved`, `Liked`, `Ok`, or `Not for me`).
3. Scroll down to snap to the AI Recommendation Engine.
4. Click **What to watch next** and wait for Gemini to calculate your perfect watch list!
5. Scroll horizontally through the carousel and click on a movie to read exactly why the AI thinks you will enjoy it.

---
*Built as a smart alternative to traditional IMDB watchlists.*
