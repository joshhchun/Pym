import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewFile from "./pages/NewFile";
import Display from "./pages/Display";
import NewText from "./pages/NewText";
import URL from "./pages/URL";
import ReactGA from "react-ga";

const TRACKING_ID = "G-B805EY85RN";
ReactGA.initialize(TRACKING_ID);

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/newtext" element={<NewText />} />
                    <Route path="/newfile" element={<NewFile />} />
                    <Route path="/url" element={<URL />} />
                    <Route path="/:id" element={<Display />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
