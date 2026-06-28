import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "./context/AuthContext";

import Auth from "./pages/Auth";
import Feeds from "./pages/Feeds";
import CreatePost from "./pages/CreatePost";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/feed" replace /> : <Auth />}
        />

        <Route
          path="/auth"
          element={user ? <Navigate to="/feed" replace /> : <Auth />}
        />

        <Route
          path="/feed"
          element={user ? <Feeds /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/createPost"
          element={user ? <CreatePost /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
