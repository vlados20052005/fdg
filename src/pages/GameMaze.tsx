import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MazeComponent } from "../components/MazeComponent.tsx";

interface Maze {
  id: number;
  gridSize: number;
}

interface GameMazeProps {
  level?: Maze;
}

export function GameMaze({ level }: GameMazeProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const mazeLevel = level || (location.state as Maze);

  const [gyroEnabled, setGyroEnabled] = useState(false);

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

  const handleResetLevel = () => {
    navigate(`/play/${mazeLevel.id}`, { state: mazeLevel });
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-900 text-white"
      style={{
        height: "100vh", // Full viewport height
        overflow: "hidden", // Remove scrolling
      }}
    >
      {!gyroEnabled && (
        <button
          onClick={requestGyroPermission}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "orange",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Enable Gyroscope and Sound
        </button>
      )}
      <h1 className="text-4xl font-bold" style={{ marginTop: 0 }}>
        Game Maze
      </h1>
      <p className="text-lg mb-6">
        You are playing Level {mazeLevel.id} with a grid size of{" "}
        {mazeLevel.gridSize}.
      </p>
      <MazeComponent gridSize={mazeLevel.gridSize} levelId={mazeLevel.id} />
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleResetLevel}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg"
        >
          Reset Level
        </button>
        <Link to="/play">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg">
            Back to Levels
          </button>
        </Link>
      </div>
    </div>
  );
}
