import { useEffect, useState } from 'react';
import { backtrackingMazeGeneration, Cell, initializeMaze } from "../services/maze.ts";

interface MazeComponentProps {
    gridSize: number;
    levelId: number; // Pass the level ID to link scores
}

export function MazeComponent({ gridSize, levelId }: MazeComponentProps) {
    const [mazeGrid, setMazeGrid] = useState<Cell[][]>([]);
    const [player, setPlayer] = useState({ row: 1, col: 1 });
    const [finish, setFinish] = useState({ row: gridSize - 2, col: gridSize - 2 });
    const [gameOver, setGameOver] = useState(false);
    const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [lastGyroMove, setLastGyroMove] = useState<number>(0); // Debounce gyroscope inputs

    // Initialize the maze
    useEffect(() => {
        const initialGrid = initializeMaze(gridSize);
        backtrackingMazeGeneration(initialGrid, { row: 1, col: 1 });

        initialGrid[gridSize - 2][gridSize - 2].isWall = false;

        setMazeGrid(initialGrid);
        setPlayer({ row: 1, col: 1 });
        setFinish({ row: gridSize - 2, col: gridSize - 2 });
        setGameOver(false);
        setGameState('playing');
        setMoves(0);
        setStartTime(Date.now());
    }, [gridSize]);

    // Handle player movement
    const handleMove = (direction: string) => {
        if (gameOver || gameState === 'finished') return;

        let { row, col } = player;
        switch (direction) {
            case 'up':
                if (row > 0 && !mazeGrid[row - 1][col].isWall) row -= 1;
                break;
            case 'down':
                if (row < gridSize - 1 && !mazeGrid[row + 1][col].isWall) row += 1;
                break;
            case 'left':
                if (col > 0 && !mazeGrid[row][col - 1].isWall) col -= 1;
                break;
            case 'right':
                if (col < gridSize - 1 && !mazeGrid[row][col + 1].isWall) col += 1;
                break;
            default:
                break;
        }

        if (row !== player.row || col !== player.col) {
            setPlayer({ row, col });
            setMoves((prev) => prev + 1);

            if (row === finish.row && col === finish.col) {
                setGameOver(true);
                setGameState('finished');
                const elapsedTime = Math.round((Date.now() - (startTime ?? Date.now())) / 1000);

                const newScore = {
                    player: 'Player',
                    time: elapsedTime,
                    moves,
                    completionTime: new Date().toISOString(),
                };

                try {
                    const existingScoresJSON = localStorage.getItem(`highscores-level-${levelId}`);
                    const existingScores = existingScoresJSON ? JSON.parse(existingScoresJSON) : [];
                    if (!Array.isArray(existingScores)) {
                        throw new Error('Invalid high scores data in localStorage');
                    }

                    const updatedScores = [...existingScores, newScore].sort((a, b) => a.time - b.time);
                    localStorage.setItem(`highscores-level-${levelId}`, JSON.stringify(updatedScores));
                } catch (error) {
                    console.error('Error updating high scores:', error);
                }
            }
        }
    };

    // Prevent vertical scrolling caused by arrow keys or swipes
    useEffect(() => {
        const preventScroll = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
            }
        };

        const preventTouchScroll = (e: TouchEvent) => {
            e.preventDefault();
        };

        window.addEventListener('keydown', preventScroll);
        window.addEventListener('touchmove', preventTouchScroll, { passive: false });

        return () => {
            window.removeEventListener('keydown', preventScroll);
            window.removeEventListener('touchmove', preventTouchScroll);
        };
    }, []);

    // Arrow key controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    handleMove('up');
                    break;
                case 'ArrowDown':
                    handleMove('down');
                    break;
                case 'ArrowLeft':
                    handleMove('left');
                    break;
                case 'ArrowRight':
                    handleMove('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [player, mazeGrid, gameOver, gameState]);

    // Touch controls (swipes)
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            const touchStartX = e.touches[0].clientX;
            const touchStartY = e.touches[0].clientY;

            const handleTouchMove = (e: TouchEvent) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;

                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) {
                        handleMove('right');
                    } else {
                        handleMove('left');
                    }
                } else {
                    if (dy > 0) {
                        handleMove('down');
                    } else {
                        handleMove('up');
                    }
                }

                window.removeEventListener('touchmove', handleTouchMove);
            };

            window.addEventListener('touchmove', handleTouchMove);
        };

        window.addEventListener('touchstart', handleTouchStart);
        return () => window.removeEventListener('touchstart', handleTouchStart);
    }, [player, mazeGrid, gameOver, gameState]);

    // Gyroscope controls
    useEffect(() => {
        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            const now = Date.now();
            const debounceTime = 300; // Prevents overly frequent movements
            const tiltThreshold = 15; // Minimum tilt angle to trigger a movement

            if (!event.gamma || !event.beta || now - lastGyroMove < debounceTime) return;

            if (event.gamma > tiltThreshold) {
                handleMove('right');
                setLastGyroMove(now);
            } else if (event.gamma < -tiltThreshold) {
                handleMove('left');
                setLastGyroMove(now);
            }

            if (event.beta > tiltThreshold) {
                handleMove('down');
                setLastGyroMove(now);
            } else if (event.beta < -tiltThreshold) {
                handleMove('up');
                setLastGyroMove(now);
            }
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation);
        return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
    }, [player, mazeGrid, gameOver, gameState, lastGyroMove]);

    return (
        <div style={{ textAlign: 'center' }}>
            {gameState === 'finished' && <h2 style={{ color: 'blue' }}>Game Over!</h2>}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gap: '2px',
                    margin: '0 auto',
                    width: '90vw',
                    maxWidth: '600px',
                }}
            >
                {mazeGrid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const cellStyle = {
                            width: '100%',
                            paddingBottom: '100%',
                            backgroundColor: cell.isWall ? 'black' : 'white',
                            position: 'relative' as const,
                        };

                        if (player.row === rowIndex && player.col === colIndex) {
                            cellStyle.backgroundColor = 'blue';
                        }

                        if (finish.row === rowIndex && finish.col === colIndex) {
                            cellStyle.backgroundColor = 'green';
                        }

                        return <div key={`${rowIndex}-${colIndex}`} style={cellStyle}></div>;
                    })
                )}
            </div>
            <p>Moves: {moves}</p>
            <p>Use arrow keys, swipe, or tilt your device to move the player (blue) to the finish (green).</p>
        </div>
    );
}
