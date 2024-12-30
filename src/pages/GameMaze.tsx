import { Link, useLocation  } from "react-router-dom";
import { useState, useEffect } from "react";
import MazeComponent from "../components/MazeComponent";

interface Maze {
  id: number;
  gridSize: number;
  difficulty: string;
  hint?: string;
}

interface GameMazeProps {
  level?: Maze;
  levels?: Maze[];
}

export function GameMaze({ level, levels  }: GameMazeProps) {
  const location = useLocation();
  const mazeLevel = level || (location.state as Maze);
  const allLevels = levels || (location.state?.levels as Maze[]);
  const [hintVisible, setHintVisible] = useState(false);

  const [, setGyroEnabled] = useState(false);

  useEffect(() => {
    const requestGyroPermission = () => {
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        "requestPermission" in DeviceMotionEvent
      ) {
        (
          DeviceMotionEvent as typeof DeviceMotionEvent & {
            requestPermission?: () => Promise<"granted" | "denied">;
          }
        )
          .requestPermission?.()
          .then((response) => {
            if (response === "granted") {
              setGyroEnabled(true);
            } else {
              alert("Gyroscope permission was denied.");
            }
          })
          .catch(() =>
            alert("Gyroscope permission is not supported on this device.")
          );
      } else {
        setGyroEnabled(true);
      }
    };

    requestGyroPermission();
  }, []);

  const toggleHint = () => {
    setHintVisible((prev) => !prev);
  };


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
    <div
      className="flex flex-col items-center justify-center bg-gray-900 text-white "
      
    >
      <h1 className="text-4xl font-bold" style={{ marginTop: 0 }}>
        Game Maze
      </h1>
      <p className="text-lg mb-6">
        You are playing Level {mazeLevel.id} with a grid size of{" "}
        {mazeLevel.gridSize}.
      </p>
      <MazeComponent
        gridSize={mazeLevel.gridSize}
        levelId={mazeLevel.id}
        levels={allLevels}
      />
      {hintVisible && (
          <div
            className="bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-center text-center max-w-max "
            style={{marginBottom: "5px"}}
          >
            {mazeLevel.hint}
          </div>
        )}
      <div className="flex flex-col space-y-4 mt-6 items-center justify-center">
      {mazeLevel.hint && (
          <button
            onClick={toggleHint}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg shadow-lg "
          >
            {hintVisible ? "Hide Hint" : "Show Hint"}
          </button>
        )}
        
        <Link to="/play">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg " style={{marginLeft: "5px"}}>
            Back to Levels
          </button>
        </Link>
      </div>
    </div>
  );
}