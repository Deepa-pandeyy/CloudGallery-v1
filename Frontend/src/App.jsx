import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Feeds from "./pages/Feeds"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/createPost" element={<CreatePost/>} />
          <Route path="/feed" element={<Feeds/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
