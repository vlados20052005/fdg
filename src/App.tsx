import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {GameMenu} from "./pages/GameMenu.tsx";
import {SelectLevel} from "./pages/SelectLevel.tsx";
import {GameMaze} from "./pages/GameMaze.tsx";
import { HighScores } from './pages/Scores.tsx';


function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GameMenu />} />
                <Route path="/play" element={<SelectLevel />} />
                <Route path="/play/:id" element={<GameMaze />} />
                <Route path="/high-scores" element={<HighScores />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
