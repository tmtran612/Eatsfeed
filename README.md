# Eatsfeed

A modern restaurant discovery app built with Next.js, FastAPI, Google Places API, and OpenAI for AI-powered review summaries.

## Features
- **Nearby Restaurant Search:** Uses Google Places API to find restaurants near your location.
- **Map & Swipe Views:** Interactive map and swipeable cards for browsing restaurants.
- **Detailed Restaurant Info:** Fetches real details (address, phone, hours, website, reviews) from Google Places API.
- **AI Review Summaries:** Summarizes real user reviews using OpenAI for instant, concise insights.
- **Caching:** Uses React Query for frontend caching and FastAPI for backend caching to minimize API calls and speed up the app.
- **Group Recommendations & Chat:** Create groups, chat, and share restaurant picks.
- **Mobile Friendly:** Responsive design for all devices.

## Setup Instructions

1. **Clone the repo:**
   ```sh
   git clone https://github.com/tmtran612/Eatsfeed.git
   cd Eatsfeed
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in:
     - `GOOGLE_PLACES_API_KEY` (Google Cloud Console)
     - `OPENAI_API_KEY` (OpenAI account)
     - `NEXT_PUBLIC_API_BASE_URL` (usually `http://localhost:8000` for local dev)

4. **Start the backend (FastAPI):**
   ```sh
   cd backend
   uvicorn main:app --reload
   ```

5. **Start the frontend (Next.js):**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```

6. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes
- **AI Summaries:** The app uses OpenAI to summarize reviews. Summaries are generated on-demand and cached for speed and cost efficiency.
- **Caching:** React Query caches API responses on the frontend. FastAPI caches results on the backend to reduce Google API usage.
- **API Keys:** Keep your API keys secure and never commit them to git.

## License
MIT
