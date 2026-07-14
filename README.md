# GreenTrack 🌲

GreenTrack is a gamified environmental conservation platform designed to encourage, verify, and track tree plantations across the globe. By linking physical planting actions to local community hubs using geospatial queries, GreenTrack brings communities together to make the world a greener place.

---

## 🚀 Key Features

* 🌳 **Tree Registration**: Upload tree photos and capture precise GPS coordinates (Latitude & Longitude) to record your planting legacy.
* 📍 **Geospatial Community Matching**: Uses MongoDB `2dsphere` index and `$geoIntersects` to check if a tree is planted inside active local boundaries (like **Mumbai** or **Chennai**).
* 🗺️ **Dynamic Geocoding Community Engine**: Uses OpenStreetMap's Nominatim API to dynamically reverse-geocode any coordinates outside pre-seeded boundaries. It automatically identifies the city name, creates a new Community Hub on-the-fly, and assigns the user to it immediately on planting!
* ✂️ **Interactive Image Cropper**: Includes a premium custom canvas-based `CropModal` allowing users to drag, zoom, and rotate their profile picture before cropping it to a clean 300x300 format.
* 🔑 **Google OAuth 2.0 Auth**: Log in seamlessly via Google Sign-In. Configured with secure backend token validation (`google-auth-library`) and automatic avatar synchronization.
* 💾 **Session Cache Persistence**: Uses `localStorage` session caching in the React context to ensure reloads are instant and flicker-free without logging the user out.
* 🎖️ **Dynamic RPG Progression & XP**: Fully dynamic level badges and XP progress bars calculated on-the-fly from the user's global points (`Level = globalPoints / 100 + 1`).
* 🏆 **Gamified Rewards System**: Earn **100 Points** for every tree planted, **50 Points** for sharing community updates, **20 Points** for comments, and **5 Points** for post likes. Points are cleanly synced across global, local, and community standings.
* 👥 **Social Circles**: Follow/unfollow other environmental guardians, view followers/following stats, and discover active profiles via recommended follow suggestions.
* 💬 **Community Hub & Feed**: Share text updates and view real-time feeds of green achievements specific to your local community chapter.
* 🗑️ **Tree Record Management**: Users can delete their registered trees, which cleanly removes the metadata, unlinks points, and deletes the uploaded image from the server to save space.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), TailwindCSS, Lucide Icons, React Router, `@react-oauth/google`
* **Backend**: Node.js, Express.js (ES Modules, Cookie-Parser, CORS), `google-auth-library`
* **Database**: MongoDB (Mongoose schemas, 2dsphere indexing)
* **File Uploads**: Multer Middleware (Local Disk Storage)
* **Geocoding**: OpenStreetMap Nominatim REST API (with native Node `https` connection)

---

## 📂 Project Structure

```text
workingongreentrack/
├── client/                  # React Frontend Codebase
│   ├── src/
│   │   ├── api/             # API configuration (API_BASE_URL)
│   │   ├── components/      # UI components (Navbar, CropModal, etc.)
│   │   ├── context/         # React Context (AuthContext with session cache)
│   │   └── pages/           # Pages (Dashboard, Community, Feed, Friends, MyTrees, Rankings, Login, Profile)
│   └── package.json
│
└── server/                  # Node/Express Backend Codebase
    ├── config/              # Express / DB settings
    ├── controllers/         # REST Controllers (user, tree, post, community, leaderboard)
    ├── database/            # Database connection setup
    ├── middleware/          # JWT auth & Multer file upload middlewares
    ├── models/              # MongoDB Models (User, Tree, Post, Community)
    ├── routes/              # Route handlers
    ├── uploads/             # Server storage directory for uploaded tree photos
    ├── utils/               # Utility functions (OSM geocoder helper)
    ├── seed.js              # Database seed script for initializing community boundaries
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/en) (v18+ recommended)
* MongoDB connection URI (Atlas cluster or local instance)
* Google Client ID (for OAuth setup)

### Installation & Setup

1. **Clone the repository and install root dependencies**:
   ```bash
   npm install
   ```

2. **Configure Backend Environment Variables**:
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_uri
   ACCESS_TOKEN_SECRET=your_super_secret_access_key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
   REFRESH_TOKEN_EXPIRY=10d
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

3. **Initialize Community Boundaries (Seeding)**:
   Populate local communities (like Mumbai and Chennai) inside your database:
   ```bash
   cd server
   node seed.js
   ```

4. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

5. **Start the Frontend Application**:
   Open a separate terminal and navigate to the client folder:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The client dev server runs on `http://localhost:5173`.*

---

## 🛡️ License

This project is built for environmental awareness and educational purposes. Feel free to fork, expand, and utilize it to drive green initiatives!
