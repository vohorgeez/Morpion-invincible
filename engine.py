WIN_LINES = [
    (0,1,2), (3,4,5), (6,7,8), #lignes
    (0,3,6), (1,4,7), (2,5,8), #colonnes
    (0,4,8), (2,4,6) #diagonales
]

# --- Compteur de noeuds pour le minimax ---
NODES_VISITED = 0

def reset_node_counter():
    global NODES_VISITED
    NODES_VISITED = 0

def get_node_counter():
    return NODES_VISITED

# --- Moteur de jeu de base ---

def create_board():
    return [" "]*9

def has_won(board, player):
    for a, b, c in WIN_LINES:
        if board[a] == board[b] == board[c] == player:
            return True
    return False

def is_full(board):
    return " " not in board
    
def get_winner(board):
    if has_won(board, "X"):
        return "X"
    elif has_won(board, "O"):
        return "O"
    elif is_full(board):
        return "draw"
    else:
        return None

def get_legal_moves(board):
    return [i for i, cell in enumerate(board) if cell == " "]

# --- Evaluation zéro-heuristique (positions terminales uniquement) ---

def evaluate_terminal(board):
    """
    Retourne :
    1 si X gagne
    -1 si O gagne
    0 si match nul
    None si la position n'est pas terminale
    """
    winner = get_winner(board)
    if winner == "X":
        return 1
    elif winner == "O":
        return -1
    elif winner == "draw":
        return 0
    else:
        return None 
    
# --- Minimax avec élagage alpha-beta ---
    
def minimax_ab(board, is_maximizing, alpha, beta, depth=0):
    """
    Minimax exhaustif avec élagage alpha-beta.
    Pas d'heuristique : on ne note que les positions terminales.
    """
    global NODES_VISITED
    NODES_VISITED += 1

    score = evaluate_terminal(board)
    if score is not None:
        return score
    
    legal_moves = get_legal_moves(board)

    if is_maximizing:
        value = float("-inf")
        for move in legal_moves:
            board[move] = "X"
            value = max(value, minimax_ab(board, False, alpha, beta, depth+1))
            board[move] = " "
            alpha = max(alpha, value)
            if beta <= alpha:
                break # élagage
        return value
    else:
        value = float("inf")
        for move in legal_moves:
            board[move] = "O"
            value = min(value, minimax_ab(board, True, alpha, beta, depth+1))
            board[move] = " "
            beta = min(beta, value)
            if beta <= alpha:
                break # élagage
        return value
    
# Ordre préféré pour les coups (centre > coins > bords)
PREFERRED_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7]

def ordered_legal_moves(board):
    legal = set(get_legal_moves(board))
    return [m for m in PREFERRED_ORDER if m in legal]

def choose_best_move(board):
    """
    Choisit le meilleur coup pour X avec minimax + alpha-beta.
    Centre / coins sont testés en priorité pour optimiser l'élagage et garantir un premier coup "propre" (centre).
    """
    reset_node_counter()
    legal_moves = ordered_legal_moves(board)
    best_move = legal_moves[0]
    best_score = float("-inf")

    for move in legal_moves:
        board[move] = "X"
        score = minimax_ab(board, False, float("-inf"), float("inf"), depth=1)
        board[move] = " "
        if score > best_score:
            best_score = score
            best_move = move
    return best_move

# --- Petite API pratique ---

def apply_move(board, index, player):
    """
    Retourne un nouveau plateau après avoir joué 'player' en 'index'.
    Ne modifie pas le plateau d'origine.
    """
    new_board = board.copy()
    new_board[index] = player
    return new_board

def make_ai_move(board):
    """
    Joue le meilleur coup pour X sur 'board'.
    Retourne (nouveau_plateau, coup_joué, noeuds_explorés).
    """
    move = choose_best_move(board)
    nodes = get_node_counter()
    new_board = apply_move(board, move, "X")
    return new_board, move, nodes