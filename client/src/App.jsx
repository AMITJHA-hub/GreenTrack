import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Feed from "./pages/Feed.jsx";
import Friends from "./pages/Friends.jsx";
import MyTrees from "./pages/MyTrees.jsx";
import Rankings from "./pages/Rankings.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/community" element={<Community />} />

                <Route path="/feed" element={<Feed />} />

                <Route path="/friends" element={<Friends />} />

                <Route path="/mytrees" element={<MyTrees />} />

                <Route path="/rankings" element={<Rankings />} />

                <Route path="/profile" element={<Profile />} />

            </Route>

        </Routes>
    );
}

export default App;