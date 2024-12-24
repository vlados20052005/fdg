import { Link, useLocation } from 'react-router-dom';
import { MazeComponent } from '../components/MazeComponent.tsx';

interface Maze {
    id: number;
    gridSize: number;
}

interface GameMazeProps {
    level?: Maze;
}

export function GameMaze({ level }: GameMazeProps) {
    const location = useLocation();
    const mazeLevel = level || (location.state as Maze); // Explicitly cast location.state to Maze

    if (!mazeLevel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2 className="text-4xl font-bold mb-6">Invalid Level</h2>
                <Link to="/play">
                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
                        Back to Levels
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold" style={{marginTop: 0}}>Game Maze</h1>
            <p className="text-lg mb-6">
                You are playing Level {mazeLevel.id} with a grid size of {mazeLevel.gridSize}.
            </p>
            {/* Pass the level ID as a prop */}
            <MazeComponent gridSize={mazeLevel.gridSize} levelId={mazeLevel.id} />
            <Link to="/play">
                <button className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
                    Back to Levels
                </button>
            </Link>
        </div>
    );
}