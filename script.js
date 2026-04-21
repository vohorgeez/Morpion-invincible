const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const HUMAN = "O";
const AI    = "X";
const EMPTY = " ";
const PREFERRED_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

// ── Logique pure ──────────────────────────────────────────────

function createBoard() {
    return Array(9).fill(EMPTY);
}

function getLegalMoves(board) {
    return PREFERRED_ORDER.filter(i => board[i] === EMPTY);
}

function getWinner(board) {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] !== EMPTY && board[a] === board[b] && board[b] === board[c]) {
            return board[a]; // "X" ou "O"
        }
    }
    return getLegalMoves(board).length === 0 ? "draw" : null;
}

function applyMove(board, index, player) {
    const next = board.slice();
    next[index] = player;
    return next;
}

// ── Minimax avec alpha-beta ───────────────────────────────────

let nodesVisited = 0;

function minimax(board, player, alpha, beta) {
    nodesVisited++;
    const winner = getWinner(board);
    if (winner === AI)    return  1;
    if (winner === HUMAN) return -1;
    if (winner === "draw") return  0;

    if (player === AI) {
        let best = -Infinity;
        for (const move of getLegalMoves(board)) {
            const score = minimax(applyMove(board, move, AI), HUMAN, alpha, beta);
            best  = Math.max(best, score);
            alpha = Math.max(alpha, best);
            if (alpha >= beta) break;
        }
        return best;
    } else {
        let best = Infinity;
        for (const move of getLegalMoves(board)) {
            const score = minimax(applyMove(board, move, HUMAN), AI, alpha, beta);
            best = Math.min(best, score);
            beta = Math.min(beta, best);
            if (alpha >= beta) break;
        }
        return best;
    }
}

function chooseBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;
    for (const move of getLegalMoves(board)) {
        const score = minimax(applyMove(board, move, AI), HUMAN, -Infinity, Infinity);
        if (score > bestScore) { bestScore = score; bestMove = move; }
    }
    return bestMove;
}

function getRandomMove(board) {
    const moves = getLegalMoves(board);
    return moves[Math.floor(Math.random() * moves.length)];
}

function getAiMove(board, mode) {
    nodesVisited = 0;
    return mode === "easy" ? getRandomMove(board) : chooseBestMove(board);
}

// ── État du jeu ───────────────────────────────────────────────

let board         = createBoard();
let mode          = "perfect";
let gameOver      = false;
let aiThinking    = false;
let startingPlayer = HUMAN;

// ── Éléments DOM ─────────────────────────────────────────────

const gridEl    = document.getElementById("grid");
const statusEl  = document.getElementById("status");
const modeEl    = document.getElementById("mode");
const resetEl   = document.getElementById("reset");
const starterEl = document.getElementById("starter");
const aiTimeEl  = document.getElementById("aiTime");
const aiNodesEl = document.getElementById("aiNodes");
const themeToggleEl = document.getElementById("themeToggle");

// ── Thème ─────────────────────────────────────────────────────

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

// ── Rendu ─────────────────────────────────────────────────────

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

function clearWinHighlight() {
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
        const cell = cells[i];
        const val  = board[i];
        cell.textContent = val === EMPTY ? "" : val;
        cell.dataset.player = val === EMPTY ? "" : val; // pour CSS couleurs
        cell.disabled = gameOver || aiThinking || val !== EMPTY;
    }
    // Classe visuelle "IA réfléchit"
    gridEl.classList.toggle("thinking", aiThinking && !gameOver);
}

// ── Fin de partie ─────────────────────────────────────────────

function endGame(winner) {
    gameOver = true;

    const line = getWinningLine(board);
    if (line) {
        for (const idx of line) gridEl.children[idx].classList.add("win");
    }

    if (winner === "draw") {
        setStatus("Match nul — l'IA a quand même failli s'ennuyer.");
    } else if (winner === AI) {
        setStatus("L'IA gagne. Comme prévu.");
    } else {
        setStatus("Tu as gagné ? Mode facile détecté.");
    }

    render();
}

function checkGameState() {
    const w = getWinner(board);
    if (w === null) return false;
    endGame(w);
    return true;
}

// ── Interactions ──────────────────────────────────────────────

function onCellClick(e) {
    if (gameOver || aiThinking) return;
    const idx = Number(e.currentTarget.dataset.index);
    if (board[idx] !== EMPTY) return;

    clearWinHighlight();
    board = applyMove(board, idx, HUMAN);
    render();

    if (checkGameState()) return;
    aiTurn();
}

function aiTurn() {
    aiThinking = true;
    setStatus("L'IA réfléchit…");
    render();

    setTimeout(() => {
        const t0   = performance.now();
        const move = getAiMove(board, mode);
        const t1   = performance.now();

        aiNodesEl.textContent = String(nodesVisited);
        aiTimeEl.textContent  = (t1 - t0).toFixed(2);

        board = applyMove(board, move, AI);
        aiThinking = false;
        render();

        if (!checkGameState()) {
            setStatus("À toi de jouer (O).");
        }
    }, 120);
}

function resetGame() {
    board      = createBoard();
    gameOver   = false;
    aiThinking = false;
    nodesVisited = 0;
    aiTimeEl.textContent  = "—";
    aiNodesEl.textContent = "—";
    clearWinHighlight();
    render();

    if (startingPlayer === AI) {
        setStatus("L'IA ouvre le jeu…");
        aiTurn();
    } else {
        setStatus("À toi de jouer (O).");
    }
}

// ── Événements UI ─────────────────────────────────────────────

modeEl.addEventListener("change", () => { mode = modeEl.value; });

starterEl.addEventListener("change", () => {
    startingPlayer = starterEl.value;
    resetGame();
});

resetEl.addEventListener("click", resetGame);

// ── Boot ──────────────────────────────────────────────────────

initGrid();
resetGame();