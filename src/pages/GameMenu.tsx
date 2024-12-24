import { Link } from 'react-router-dom';

export function GameMenu() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            <h1 className="text-5xl font-bold mb-8">Maze Game Menu</h1>
            <div className="space-y-4">
                <Link to="/play">
                    <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg">
                        Start Game
                    </button>
                </Link>
                <Link to="/high-scores">
                    <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg min-h-max">
                        View High Scores
                    </button>
                </Link>
            </div>
        </div>
    );
}
