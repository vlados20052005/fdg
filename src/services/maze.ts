export interface Maze {
    id: number;
    gridSize: number;
    difficulty: number;

}

export interface Cell {
    row: number;
    col: number;
    isWall: boolean;
}

export function backtrackingMazeGeneration(grid: Cell[][], start: { row: number; col: number }) {
    const stack = [start];

    const directions = [
        { row: -2, col: 0 }, // Вверх
        { row: 2, col: 0 },  // Вниз
        { row: 0, col: -2 }, // Влево
        { row: 0, col: 2 },  // Вправо
    ];

    const isInBounds = (row: number, col: number) =>
        row > 0 && col > 0 && row < grid.length - 1 && col < grid[0].length - 1;

    const getWallBetween = (current: { row: number; col: number }, next: { row: number; col: number }) => {
        return {
            row: Math.floor((current.row + next.row) / 2),
            col: Math.floor((current.col + next.col) / 2),
        };
    };

    grid[start.row][start.col].isWall = false; // Начальная точка - не стена

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = directions
            .map((dir) => ({ row: current.row + dir.row, col: current.col + dir.col }))
            .filter(({ row, col }) =>
                isInBounds(row, col) && grid[row][col].isWall
            );

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const wall = getWallBetween(current, next);

            // Создаём путь
            grid[wall.row][wall.col].isWall = false;
            grid[next.row][next.col].isWall = false;

            stack.push(next);
        }
    }
}

export function initializeMaze(gridSize: number): Cell[][] {
    const grid: Cell[][] = [];

    // Создание сетки с начальными значениями
    for (let row = 0; row < gridSize; row++) {
        const rowCells: Cell[] = [];
        for (let col = 0; col < gridSize; col++) {
            rowCells.push({ row, col, isWall: true });
        }
        grid.push(rowCells);
    }

    return grid;
}


