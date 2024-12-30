export interface Player {
    name: string;
    score: number;
    userProgress: number;
}

export function createPlayer(name: string): Player {
    return {
        name,
        score: 0,
        userProgress: 0
    };
}

export function updateScore(player: Player, score: number): Player {
    return {
        ...player,
        score: player.score + score
    };
}

export function updateProgress(player: Player, progress: number): Player {
    return {
        ...player,
        userProgress: progress
    };
}        