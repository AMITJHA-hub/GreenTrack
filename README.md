# GreenTrack 🌲

GreenTrack is a gamified environmental conservation platform designed to encourage, verify, and track tree plantations across the globe. By linking physical planting actions to local community hubs using geospatial queries, GreenTrack brings communities together to make the world a greener place.

---

## 🚀 Key Features

* 🌳 **Tree Registration**: Upload tree photos and capture precise GPS coordinates (Latitude & Longitude) to record your planting legacy.
* 📍 **Geospatial Community Matching**: Uses MongoDB `2dsphere` index and `$geoIntersects` to check if a tree is planted inside active local boundaries (like **Mumbai** or **Chennai**).
* 🏆 **Gamified Rewards System**: Earn **10 Global Points** for every tree planted, plus **10 Local Points** if the tree falls inside an active local community boundary. Deleting a tree dynamically deducts points.
* 👥 **Social Circles**: Follow/unfollow other environmental guardians, view followers/following stats, and discover active profiles via recommended follow suggestions.
* 💬 **Community Hub & Feed**: Share text updates and view real-time feeds of green achievements specific to your local community chapter.
* 🗑️ **Tree Record Management**: Users can delete their registered trees, which cleanly removes the metadata, unlinks points, and deletes the uploaded image from the server to save space.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), TailwindCSS, Lucide Icons, React Router
* **Backend**: Node.js, Express.js (ES Modules, Cookie-Parser, CORS)
* **Database**: MongoDB (Mongoose schemas, 2dsphere indexing)
* **File Uploads**: Multer Middleware (Local Disk Storage)

---

## 📂 Project Structure

```text
workingongreentrack/
├── client/                  # React Frontend Codebase
│   ├── src/
│   │   ├── api/             # API configuration (API_BASE_URL)
│   │   ├── components/      # UI components (Navbar, etc.)
│   │   └── pages/           # Pages (Dashboard, Community, Friends, MyTrees, Rankings)
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
    ├── seed.js              # Database seed script for initializing community boundaries
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/en) (v18+ recommended)
* MongoDB connection URI (Atlas cluster or local instance)

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
