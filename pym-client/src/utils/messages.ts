export const pyMessage = `
def maxAreaOfIsland(grid: list[list[int]]) -> int:
    max_area = 0
    m, n = len(grid), len(grid[0])
    
    for row in range(m):
        for col in range(n):
            if grid[row][col]:
                max_area = max(max_area, dfs(row, col, grid))
                
    return max_area                    

def dfs(row: int, col: int, grid: list[list[int]], curr_area: int = 1) -> int:
    grid[row][col] = 0
    for direction in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        new_row, new_col = row + direction[0], col + direction[1]
        if not (0 <= new_row < len(grid) and 0 <= new_col < len(grid[0])):
            continue
        if grid[new_row][new_col]:
            curr_area = dfs(new_row, new_col, grid, curr_area + 1)
    
    return curr_area
`;

export const tsMessage = `
function maxAreaOfIsland(grid: number[][]) {
    let max_area = 0;
    let m = grid.length;
    let n = grid[0].length;

    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (grid[row][col]) {
                max_area = Math.max(max_area, dfs(row, col, grid));
            }
        }
    }

    return max_area;
}

function dfs(row: number, col: number, grid: number[][], curr_area = 1) {
    grid[row][col] = 0;
    let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < directions.length; i++) {
        let new_row = row + directions[i][0];
        let new_col = col + directions[i][1];
        if (new_row < 0 || new_row >= grid.length || new_col < 0 || new_col >= grid[0].length) {
            continue;
        }
        if (grid[new_row][new_col]) {
            curr_area = dfs(new_row, new_col, grid, curr_area + 1);
        }
    }
    return curr_area;
}
`;

export const goMessage = `
func maxAreaOfIsland(grid [][]int) int {
    maxArea := 0
    m := len(grid)
    n := len(grid[0])

    for row := 0; row < m; row++ {
        for col := 0; col < n; col++ {
            if grid[row][col] == 1 {
                area := dfs(row, col, 1, grid)
                maxArea = max(maxArea, area)
            }
        }
    }

    return maxArea
}

func dfs(row, col, currArea int, grid [][]int) int {
    grid[row][col] = 0
    directions := [][]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
    for _, dir := range directions {
        newRow := row + dir[0]
        newCol := col + dir[1]
        if (newRow < 0 || newRow >= len(grid) || newCol < 0 || newCol >= len(grid[0])) {
            continue;
        }
        if grid[newRow][newCol] == 1 {
            currArea = dfs(newRow, newCol, currArea+1, grid)
        }
    }
    return currArea
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
`;
