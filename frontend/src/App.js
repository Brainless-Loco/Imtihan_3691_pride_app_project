import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import UserProfileForm from "./components/UserProfileForm";
import PrivateRoute from "./components/PrivateRoute";
import SearchPage from "./pages/SearchPage";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotResetPassword from "./pages/Auth/ForgotResetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import ProfileSetup from "./pages/ProfileSetup";
import DirectMessaging from "./pages/DirectMessaging"; 

import Home from "./pages/Home";
import Profile from "./pages/Profile";


function UsersList() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    fetch("http://localhost:4000/api/users")

      .then((response) => {

        if (!response.ok) {

          throw new Error("Network response was not ok");

        }

        return response.json();

      })

      .then((data) => setUsers(data))

      .catch((error) => console.error("Error fetching users:", error));

  }, []);

  return (

    <div className="p-6 max-w-4xl mx-auto">

      <header className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-semibold">Pride STEM Networking – Users</h1>

        <Link to="/login" className="text-sm text-blue-600 hover:underline">Sign in</Link>

      </header>

      {users.length > 0 ? (

        <ul className="space-y-3">

          {users.map((user) => (

            <li key={user.id} className="p-3 border rounded-lg">

              <strong className="block text-lg">{user.handle}</strong>

              <span className="text-sm text-gray-600">{user.email}</span>

            </li>

          ))}

        </ul>

      ) : (

        <p className="text-red-500">Loading or no users found.</p>

      )}

    </div>

  );

}

function App() {

  return (

    <Router>

      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotResetPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

        <Route path="/createevent" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />

        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        <Route path="/edit-profile" element={<PrivateRoute><UserProfileForm /></PrivateRoute>} />

        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        
        <Route path="/profile-setup" element={<PrivateRoute><UserProfileForm /></PrivateRoute>} />

        <Route path="/messages" element={<PrivateRoute><DirectMessaging /></PrivateRoute>} />

        <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>

  );

}

export default App;
