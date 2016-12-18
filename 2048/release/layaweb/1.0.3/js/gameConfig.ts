//游戏配置项
const gameConfig: GameConfig = {
    width: 600,
    row: 4,
    height: 600,
    column: 4,
    startNumber: 2
}

interface GameConfig {
    width: number;
    row: number,
    height: number;
    column: number,
    startNumber: number;
}