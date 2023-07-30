import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import StudentDash from "./pages/StudentDash";
import StudentHistory from "./pages/StudentHistory";
import Login from "./pages/Login";
import AdminDash from "./pages/AdminDash";
import AdminHistory from "./pages/AdminHistory";
import EditPersonLimit from "./pages/EditPersonLimit";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentdash" element={<StudentDash />} />
        <Route path="/studentdash/history" element={<StudentHistory />} />
        <Route path="/studentdash/profile" element={<Profile />} />
        <Route path="/admindash/:room" element={<AdminDash />} />
        <Route
          path="/admindash/:room/editPersonLimit"
          element={<EditPersonLimit />}
        />
        <Route path="/admindash/:room/history" element={<AdminHistory />} />
        <Route path="/admindash/:room/profile" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
