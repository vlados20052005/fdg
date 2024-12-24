import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface HighScore {
    player: string;
    time: number; // in seconds
    moves: number;
    completionTime: string; // ISO string
}

export function HighScores() {
    const [levels, setLevels] = useState<number[]>([]); // List of available levels
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [highScores, setHighScores] = useState<HighScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch available levels on mount
    useEffect(() => {
        setLoading(true);
        fetch('/data/levels.json')
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
                    throw new Error('Invalid levels data format');
                }
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load levels. Please try again later.');
                console.error('Error fetching levels:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedLevel !== null) {
            setLoading(true);
    
            try {
                // Fetch high scores from localStorage
                const storedScoresJSON = localStorage.getItem(`highscores-level-${selectedLevel}`);
                const storedScores = storedScoresJSON ? JSON.parse(storedScoresJSON) : [];
    
                // Validate that the parsed data is an array
                if (!Array.isArray(storedScores)) {
                    throw new Error('Invalid high scores format');
                }
    
                // Sort the scores
                const sortedScores = storedScores.sort((a: HighScore, b: HighScore) => a.time - b.time);
                setHighScores(sortedScores);
            } catch (error) {
                console.error(`Error fetching high scores for level ${selectedLevel}:`, error);
                setHighScores([]); // Fallback to an empty array if there's an error
            }
    
            setLoading(false);
        }
    }, [selectedLevel]);
    
    
    

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white z-10">
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
            <h2 className="text-4xl font-bold mb-4">High Scores</h2>
            {loading && <p className="text-lg mb-6">Loading...</p>}
            {!loading && levels.length > 0 && (
                <div className="mb-6">
                    <label htmlFor="level-select" className="text-lg mb-2 block">Select Level:</label>
                    <select
                        id="level-select"
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                        onChange={(e) => setSelectedLevel(Number(e.target.value))}
                        value={selectedLevel || ''}
                    >
                        <option value="" disabled>Select a level</option>
                        {levels.map((level) => (
                            <option key={level} value={level}>Level {level}</option>
                        ))}
                    </select>
                </div>
            )}
            {!loading && selectedLevel !== null && highScores.length > 0 && (
                <div className="text-lg mb-6">
                    {highScores.map((score, index) => (
                        <div key={index} className="mb-2">
                            {index + 1}. Time: {score.time}s, Moves: {score.moves}, Completed: {new Date(score.completionTime).toLocaleString()}
                        </div>
                    ))}
                </div>
            )}
            {!loading && selectedLevel !== null && highScores.length === 0 && (
                <p className="text-lg mb-6">No high scores available for this level yet.</p>
            )}
            <Link to="/">
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
                    Back to Menu
                </button>
            </Link>
        </div>
    );
}
