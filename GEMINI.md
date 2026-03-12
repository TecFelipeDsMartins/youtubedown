# YouTube Downloader 2026 - Project Documentation

## Project Overview
This is a modern, full-stack YouTube video downloader capable of handling high-quality downloads (1080p, 4K) by leveraging `yt-dlp` and `ffmpeg`.

- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4, and TypeScript.
- **Backend:** Node.js, Express, `yt-dlp` (for metadata and downloading), and `FFmpeg` (for merging audio/video streams).
- **Architecture:** A decoupled architecture where the frontend communicates with a RESTful backend API. The backend processes requests by executing shell commands via `execa` to interact with `yt-dlp`.

---

## Getting Started

### Prerequisites
The backend requires external binaries to function correctly. Ensure the following files are present in the `backend/` directory:
1. `yt-dlp.exe` - [Download latest](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe)
2. `ffmpeg.exe` - [Download binaries](https://github.com/GyanD/codexffmpeg/releases/tag/7.1)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. (Optional) Create a `.env` file to specify the `PORT` (default is 4000).
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Next.js development server: `npm run dev`
4. Access the application at `http://localhost:3000`.

---

## API Reference (Backend)

### `GET /api/info?url=<youtube_url>`
Fetches video metadata and available formats.
- **Returns:** Title, thumbnail, duration, and a list of available quality formats.

### `GET /api/download?url=<youtube_url>&itag=<format_id>`
Triggers the download and streams the merged file back to the client.
- **Mechanism:** Uses `yt-dlp` with the `${itag}+bestaudio` format selection to ensure high-quality video with audio.

---

## Development Conventions

### Frontend
- **Framework:** Next.js 16 with App Router.
- **Styling:** Tailwind CSS 4 (using the `@tailwindcss/postcss` plugin).
- **State Management:** React `useState` for local UI state.
- **Type Safety:** TypeScript is used across the frontend.

### Backend
- **Runtime:** Node.js with Express.
- **Process Management:** `execa` for robust shell command execution.
- **Environment:** `dotenv` for configuration.
- **Style:** CommonJS modules.

---

## Roadmap / TODOs
- [ ] Add progress bar for downloads.
- [ ] Implement support for playlists.
- [ ] Add a queue system for multiple downloads.
- [ ] Dockerize the application for easier setup (including binaries).
