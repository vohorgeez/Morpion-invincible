const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const HUMAN = "O";
const AI = "X";
const EMPTY = " ";
const PREFERRED_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function createBoard() {
    return Array(9).fill(EMPTY);
}

// getLegalMoves(board) -> array d'indices vides
function getLegalMoves(board) {
    return PREFERRED_ORDER.filter(i => board[i] === EMPTY);
}

// getWinner(board) -> AI / HUMAN / "draw" / null
function getWinner(board) {
    for (var i = 0; i < WIN_LINES.length; i++) {
        var a = WIN_LINES[i][0];
        var b = WIN_LINES[i][1];
        var c = WIN_LINES[i][2];
        if (board[a] === board[b] && board[b] === board[c] && board[a] !== EMPTY) {
            if (board[a] === AI) {
                return AI;
            } else if (board[a] === HUMAN) {
                return HUMAN;
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

function minimax(board, player, alpha, beta) {
    nodesVisited++;
    const winner = getWinner(board);
    if (winner === AI) {
        return 1;
    } else if (winner === HUMAN) {
        return -1;
    } else if (winner === "draw") {
        return 0;
    }
    if (player === AI) {
        let bestScore = -Infinity;
        const moves = getLegalMoves(board);
        for (let i = 0; i < moves.length; i++) {
            let new_board = applyMove(board, moves[i], player);
            let score = minimax(new_board, HUMAN, alpha, beta);
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (alpha >= beta) break;
        }
        return bestScore;
    } else if (player === HUMAN) {
        let bestScore = Infinity;
        const moves = getLegalMoves(board);
        for (let i = 0; i < moves.length; i++) {
            let new_board = applyMove(board, moves[i], player);
            let score = minimax(new_board, AI, alpha, beta);
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
        let new_board = applyMove(board, moves[i], AI);
        let score = minimax(new_board, HUMAN, -Infinity, Infinity);
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
    nodesVisited = 0;
    if (mode == "easy") {
        return getRandomMove(board);
    } else {
        return chooseBestMove(board);
    }
}

// ===== UI / GAME STATE =====
let board = createBoard();
let mode = "perfect";
let gameOver = false;
let aiThinking = false;

const gridEl = document.getElementById("grid");
const statusEl = document.getElementById("status");
const modeEl = document.getElementById("mode");
const resetEl = document.getElementById("reset");
const aiTimeEl = document.getElementById("aiTime");

let nodesVisited = 0;
const aiNodesEl = document.getElementById("aiNodes");

let startingPlayer = HUMAN; // HUMAN ou AI
const starterEl = document.getElementById("starter");
starterEl.addEventListener("change", () => {
    startingPlayer = starterEl.value;
    resetGame();
});

const themeToggleEl = document.getElementById("themeToggle");

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);
themeToggleEl.checked = savedTheme === "dark";

themeToggleEl.addEventListener("change", () => {
    setTheme(themeToggleEl.checked ? "dark" : "light");
});

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
        if (board[a] !== EMPTY && board[a] === board[b] && board[b] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}

function render() {
    const cells = gridEl.children;
    for (let i = 0; i < 9; i++) {
        cells[i].textContent = board[i] === EMPTY ? "" : board[i];
        cells[i].disabled = gameOver || aiThinking || board[i] !== EMPTY;
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
    if (board[idx] !== EMPTY) return;

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
            setStatus(`A toi de jouer (${HUMAN}).`);
        }
    }, delayMs);
}

function resetGame() {
    board = createBoard();
    gameOver = false;
    aiThinking = false;
    nodesVisited = 0;
    aiTimeEl.textContent = "-";
    aiNodesEl.textContent = "-";
    clearWinHighLight();
    render();

    if (startingPlayer === AI) {
        setStatus("L'IA commence...");
        aiTurn();
    } else {
        setStatus(`A toi de jouer (${HUMAN}).`);
    }
}

// Events UI
modeEl.addEventListener("change", () => {
    mode = modeEl.value;
});

resetEl.addEventListener("click", resetGame);

// Boot
initGrid();
resetGame();