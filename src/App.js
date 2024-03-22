import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import logo from './logo.svg';
import './App.css';
import EditorPage from "./pages/EditorPage";
import Home from "./pages/Home";



function App() {
  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home/>}></Route>

          <Route path="/editor/:roomID" element={<EditorPage/>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
