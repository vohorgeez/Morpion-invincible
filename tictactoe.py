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

def print_board(board):
    for i in range (3):
        start=3*i
        print(board[start], " | ", board[start+1], " | ", board[start+2])
        if i<2:
            print("---------------")

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

# --- Interface CLI ---

def human_turn(board):
    print_board(board)
    has_played=False
    while not has_played:
        raw = input("Veuillez entrer un entier entre 0 et 8, correspondant à la case que vous souhaitez investir.")
        try:
            move = int(raw)
        except ValueError:
            print("Ce coup est incompréhensible.")
            continue
        if not 0 <= move <= 8:
            print("Ce coup est hors du plateau (les indices vont de 0 à 8).")
            continue
        legal_moves = get_legal_moves(board)
        if move in legal_moves:
            board[move] = "O"
            has_played=True
        else:
            print("Ce coup est impossible.")

def ask_who_starts():
    """
    Demande qui commence la partie.
    Retourne True si l'IA commence, False si le joueur commence.
    """
    while True:
        print("Qui commence ?")
        print("    1 - Vous (O)")
        print("    2 - IA (X)")
        choice = input("Votre choix (1 ou 2, défaut = 1) : ").strip()
        if choice == "" or choice == "1":
            return False
        if choice == "2":
            return True
        print("Entrée invalide. Merci de choisir 1 ou 2.")

def play_game():
    board = create_board()
    ai_starts = ask_who_starts()
    
    if ai_starts:
        # Premier coup de l'IA
        best_move = choose_best_move(board)
        board[best_move] = "X"
        print(f"[IA] joue en {best_move}")
        print(f"[IA] Noeuds explorés : {get_node_counter()}")

    while get_winner(board) is None:
        human_turn(board)
        winner = get_winner(board)
        if winner is not None:
            break

        best_move = choose_best_move(board)
        board[best_move] = "X"
        print(f"[IA] joue en {best_move}")
        print(f"[IA] Noeuds explorés : {get_node_counter()}")

    print_board(board)
    winner = get_winner(board)
    if winner == "draw":
        print("Match nul !")
    else:
        print(f"{winner} a gagné !")

if __name__ == "__main__":
    play_game()