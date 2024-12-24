import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Maze } from '../services/maze.ts';

export function SelectLevel() {
    const [levels, setLevels] = useState<Maze[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
                    setLevels(data.mazes);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
            <h2 className="text-4xl font-bold mb-6" style={{marginRight: "4px"}}>Select Level</h2>
            <div  style={{display: 'flex', flexDirection: 'column', margin: "4px 4px"}}>
                {levels.map((maze) => (
                    <button
                        key={maze.id}
                        onClick={() => handleLevelSelect(maze)}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg"
                        style={{margin: "4px 0"}}

                    >
                        Level {maze.id}
                    </button>
                ))}
            </div>
            <Link to="/" className="mt-6"  >
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg"  >
                    Back to Menu
                </button>
            </Link>
        </div>
    );
}
