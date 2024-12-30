import { Link } from "react-router-dom";
import {
    Menu,
    MenuHandler,
    Button,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

interface HighScore {
    player: string;
    time: number; // in seconds
    moves: number;
    completionTime: string; // ISO string
}

export function HighScores() {
    const [levels, setLevels] = useState<number[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [highScores, setHighScores] = useState<HighScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetch("/data/levels.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.mazes && Array.isArray(data.mazes)) {
                    setLevels(data.mazes.map((maze: { id: number }) => maze.id));
                } else {
                    throw new Error("Invalid levels data format");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load levels. Please try again later.");
                console.error("Error fetching levels:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedLevel !== null) {
            setLoading(true);
            try {
                const storedScoresJSON = localStorage.getItem(
                    `highscores-level-${selectedLevel}`
                );
                const storedScores = storedScoresJSON
                    ? JSON.parse(storedScoresJSON)
                    : [];

                if (!Array.isArray(storedScores)) {
                    throw new Error("Invalid high scores format");
                }

                const sortedScores = storedScores.sort(
                    (a: HighScore, b: HighScore) => a.time - b.time
                );
                setHighScores(sortedScores);
            } catch (error) {
                console.error(
                    `Error fetching high scores for level ${selectedLevel}:`,
                    error
                );
                setHighScores([]);
            }
            setLoading(false);
        }
    }, [selectedLevel]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2 className="text-4xl font-bold mb-4">Error</h2>
                <p className="text-lg mb-6">{error}</p>
                <Link to="/">
                    <Button variant="gradient" color="blue"  placeholder={undefined}
                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Back to Menu
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h2 className="text-4xl font-bold mb-8">High Scores</h2>

            {loading && <p className="text-lg mb-6">Loading...</p>}

            {!loading && levels.length > 0 && (
                <div className="relative mb-6 w-full max-w-xs">
                    {/* Material Tailwind Dropdown */}
                    <Menu>
                        <MenuHandler>
                            <Button className="p-12" variant="gradient" color="blue" fullWidth
                                    placeholder={undefined} onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}>
                                {selectedLevel !== null ? `Level ${selectedLevel}` : "Select a level"}
                            </Button>
                        </MenuHandler>
                        <MenuList className="max-h-72 overflow-auto shadow-lg border border-gray-200 rounded-lg"
                                   placeholder={undefined} onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}>
                            {levels.map((level) => (
                                <MenuItem
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className="hover:bg-blue-50 text-center"
                                    placeholder={undefined} onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}                                >
                                    Level {level}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </div>
            )}

            {!loading && selectedLevel !== null && (
                <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                        Level {selectedLevel} Stats
                    </h3>
                    {highScores.length > 0 ? (
                        <ul className="space-y-4">
                            {highScores.map((score, index) => (
                                <li
                                    key={index}
                                    className="p-4 bg-gray-700 rounded-lg shadow-md text-white"
                                >
                                    <p className="text-lg font-medium">Player: {score.player}</p>
                                    <p>Time: {score.time}s</p>
                                    <p>Moves: {score.moves}</p>
                                    <p>
                                        Completed: {new Date(score.completionTime).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-lg text-gray-300">
                            No high scores available for this level yet.
                        </p>
                    )}
                </div>
            )}

            <br/>
            <br/>

            <Link to="/">
                <Button variant="gradient" color="blue" className="mt-12 w-full"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Back to Menu
                </Button>
            </Link>
        </div>
    );
}
