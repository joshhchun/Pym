// import CodeIcon from '@mui/icons-material/Code';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NewImage from "./components/NewImage";
import Display from "./components/Display";
import ErrorPage from "./components/Display";
import NewText from "./components/NewText";
import URL from "./components/URL"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newtext" element={<NewText />} />
          <Route path="/newimage" element={<NewImage />} />
          <Route path="/url" element={<URL />} />
          <Route path="/:id" element={<Display />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
