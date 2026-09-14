import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Committee from "./pages/Committee";
import Mission from "./pages/Mission";
import Memories from "./pages/Memories";
import Proposal from "./pages/Proposal";
import Election from "./pages/Election";

function App() {
  return (
    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Committee */}
          <Route path="/committee" element={<Committee />} />

          {/* Mission */}
          <Route path="/mission" element={<Mission />} />

          {/* Memories */}
          <Route path="/memories" element={<Memories />} />
          {/* Proposal */}
          <Route path="/proposal" element={<Proposal />} />
          {/* Election */}
          <Route path="/election" element={<Election />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;