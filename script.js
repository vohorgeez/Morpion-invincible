const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function createBoard() {
    return Array(9).fill(" ");
}

// getLegalMoves(board) -> array d'indices vides
function getLegalMoves(board) {
    var legal_moves = [];
    for (var i = 0; i < board.length; i++) {
        if (board[i] === " ") {
            legal_moves.push(i);
        }
    }
    return legal_moves;
}

// getWinner(board) -> "X" / "O" / "draw" / null
function getWinner(board) {
    for (var i = 0; i < WIN_LINES.length; i++) {
        var a = WIN_LINES[i][0];
        var b = WIN_LINES[i][1];
        var c = WIN_LINES[i][2];
        if (board[a] === board[b] && board[b] === board[c] && board[a] !== " ") {
            if (board[a] === "X") {
                return "X";
            } else if (board[a] === "O") {
                return "O";
            }
        }
    }
    if (getLegalMoves(board).length === 0) {
        return "draw";
    } else {
        return null;
    }
}

// applyMove(board, index, player) -> nouveau board
function applyMove(board, index, player) {
    var new_board = board.slice();
    new_board[index] = player;
    return new_board;
}

function minimax(board, player) {
    const winner = getWinner(board);
    if (winner === "X") {
        return 1;
    } else if (winner === "O") {
        return -1;
    } else if (winner === "draw") {
        return 0;
    }
    if (player === "X") {
        let bestScore = -Infinity;
        const moves = getLegalMoves(board);
        for (let i = 0; i < moves.length; i++) {
            let new_board = applyMove(board, moves[i], player);
            let score = minimax(new_board, "O");
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else if (player === "O") {
        let bestScore = Infinity;
        const moves = getLegalMoves(board);
        for (let i = 0; i < moves.length; i++) {
            let new_board = applyMove(board, moves[i], player);
            let score = minimax(new_board, "X");
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
        }
}

function chooseBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;
    const moves = getLegalMoves(board);
    for (let i = 0; i < moves.length; i++) {
        let new_board = applyMove(board, moves[i], "X");
        let score = minimax(new_board, "O");
        if (score > bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
    }
    return bestMove;
}

function getRandomMove(board) {
    // ...
}

function getAiMove(board, mode) {
    // ...
}