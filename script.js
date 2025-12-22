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

let nodesVisited = 0;
const aiNodesEl = document.getElementById("aiNodes");

function minimax(board, player, alpha, beta) {
    nodesVisited++;
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
            let score = minimax(new_board, "O", alpha, beta);
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (alpha >= beta) break;
        }
        return bestScore;
    } else if (player === "O") {
        let bestScore = Infinity;
        const moves = getLegalMoves(board);
        for (let i = 0; i < moves.length; i++) {
            let new_board = applyMove(board, moves[i], player);
            let score = minimax(new_board, "X", alpha, beta);
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if (alpha >= beta) break;
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
        let score = minimax(new_board, "O", -Infinity, Infinity);
        if (score > bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
    }
    return bestMove;
}

function getRandomMove(board) {
    const legal_moves = getLegalMoves(board);
    return legal_moves[Math.floor(Math.random() * legal_moves.length)];
}

function getAiMove(board, mode) {
    if (mode == "easy") {
        return getRandomMove(board);
    } else {
        return chooseBestMove(board);
    }
}

// ===== UI / GAME STATE =====
const HUMAN = "O";
const AI = "X";

let board = createBoard();
let mode = "perfect";
let gameOver = false;
let aiThinking = false;

const gridEl = document.getElementById("grid");
const statusEl = document.getElementById("status");
const modeEl = document.getElementById("mode");
const resetEl = document.getElementById("reset");
const aiTimeEl = document.getElementById("aiTime");

// Construire les 9 cases (boutons)
function initGrid() {
    gridEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const btn = document.createElement("button");
        btn.className = "cell";
        btn.dataset.index = String(i);
        btn.addEventListener("click", onCellClick);
        gridEl.appendChild(btn);
    }
}

function setStatus(text) {
    statusEl.textContent = text;
}

function clearWinHighLight() {
    for (const el of gridEl.children) el.classList.remove("win");
}

function getWinningLine(board) {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] !== " " && board[a] === board[b] && board[b] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}

function render() {
    const cells = gridEl.children;
    for (let i = 0; i < 9; i++) {
        cells[i].textContent = board[i] === " " ? "" : board[i];
        cells[i].disabled = gameOver || aiThinking || board[i] !== " ";
    }
}

function endGame(winner) {
    gameOver = true;

    const line = getWinningLine(board);
    if (line) {
        for (const idx of line) gridEl.children[idx].classList.add("win");
    }

    if (winner === "draw") setStatus("Match nul. Humanité : 0, logique : 0.");
    else setStatus(`${winner} gagne.`);
}

function checkGameState() {
    const w = getWinner(board);
    if (w === null) return null;
    endGame(w);
    return w;
}

function onCellClick(e) {
    if (gameOver || aiThinking) return;

    const idx = Number(e.currentTarget.dataset.index);
    if (board[idx] !== " ") return;

    clearWinHighLight();

    //Coup humain
    board = applyMove(board, idx, HUMAN);
    render();

    if (checkGameState()) return;

    //Tour IA avec micro-délai
    aiTurn();
}

function aiTurn() {
    aiThinking = true;
    setStatus("L'IA réfléchit...");
    render();

    const delayMs = 120; // micro délai UX

    setTimeout(() => {
        const t0 = performance.now();
        const move = getAiMove(board, mode);
        const t1 = performance.now();

        aiNodesEl.textContent = String(nodesVisited);

        aiTimeEl.textContent = (t1 - t0).toFixed(2);

        board = applyMove(board, move, AI);

        aiThinking = false;
        render();

        if (!checkGameState()) {
            setStatus("A toi de jouer (O).");
        }
    }, delayMs);
}

function resetGame() {
    board = createBoard();
    gameOver = false;
    aiThinking = false;
    aiTimeEl.textContent = "-";
    aiNodesEl.textContent = "-";
    clearWinHighLight();
    setStatus("A toi de jouer (O).");
    render();
}

// Events UI
modeEl.addEventListener("change", () => {
    mode = modeEl.value;
});

resetEl.addEventListener("click", resetGame);

// Boot
initGrid();
resetGame();