export interface Maze {
    id: number;
    gridSize: number;
}

export interface Cell {
    row: number;
    col: number;
    isWall: boolean;
}

export function backtrackingMazeGeneration(grid: Cell[][], start: { row: number; col: number }) {
    const stack = [start];

    const directions = [
        { row: -2, col: 0 }, // Up
        { row: 2, col: 0 },  // Down
        { row: 0, col: -2 }, // Left
        { row: 0, col: 2 },  // Right
    ];

    const isInBounds = (row: number, col: number) =>
        row >= 0 && col >= 0 && row < grid.length && col < grid[0].length;

    const getWallBetween = (current: { row: number; col: number }, next: { row: number; col: number }) => {
        return {
            row: (current.row + next.row) / 2,
            col: (current.col + next.col) / 2,
        };
    };

    grid[start.row][start.col].isWall = false;

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = directions
            .map((dir) => ({ row: current.row + dir.row, col: current.col + dir.col }))
            .filter(({ row, col }) =>
                isInBounds(row, col) &&
                grid[row][col].isWall &&
                isInBounds((current.row + row) / 2, (current.col + col) / 2)
            );

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const wall = getWallBetween(current, next);

            // Carve the path
            grid[wall.row][wall.col].isWall = false;
            grid[next.row][next.col].isWall = false;

            stack.push(next);
        }
    }
}

export function initializeMaze(gridSize: number): Cell[][] {
    const grid: Cell[][] = [];
    for (let row = 0; row < gridSize; row++) {
        const rowCells: Cell[] = [];
        for (let col = 0; col < gridSize; col++) {
            rowCells.push({ row, col, isWall: true });
        }
        grid.push(rowCells);
    }
    return grid;
}
