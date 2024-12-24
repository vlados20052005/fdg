import { Link, useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import {Maze} from "../services/maze.ts";


export function SelectLevel() {
    const [levels, setLevels] = useState<Maze[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const shuffleArray = (array: Maze[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        fetch('/data/levels.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.mazes && Array.isArray(data.mazes)) {
                    const shuffledMazes = data.mazes; // Shuffle the levels randomly
                    setLevels(shuffledMazes);
                } else {
                    throw new Error('Invalid data format');
                }
            })
            .catch((err) => {
                setError('Failed to load levels. Please try again later.');
                console.error('Error fetching levels:', err);
            });
    }, []);

    const handleLevelSelect = (level: Maze) => {
        navigate(`/play/${level.id}`, { state: level });
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2 className="text-4xl font-bold mb-4">Error</h2>
                <p className="text-lg mb-6">{error}</p>
                <Link to="/">
                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
                        Back to Menu
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h2 className="text-4xl font-bold mb-6">Select Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {levels.sort().map((maze) => (
                    <button
                        key={maze.id}
                        onClick={() => handleLevelSelect(maze)}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg"
                    >
                        Level {maze.id}
                    </button>
                ))}
            </div>
            <Link to="/" className="mt-6">
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
                    Back to Menu
                </button>
            </Link>
        </div>
    );
}
