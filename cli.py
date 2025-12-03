from engine import (
    create_board,
    get_winner,
    get_legal_moves,
    make_ai_move
)

def print_board(board):
    for i in range (3):
        start=3*i
        print(board[start], " | ", board[start+1], " | ", board[start+2])
        if i<2:
            print("---------------")

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
        board, move, nodes = make_ai_move(board)
        print(f"[IA] joue en {move}")
        print(f"[IA] Noeuds explorés : {nodes}")

    while get_winner(board) is None:
        human_turn(board)
        winner = get_winner(board)
        if winner is not None:
            break

        board, move, nodes = make_ai_move(board)
        print(f"[IA] joue en {move}")
        print(f"[IA] Noeuds explorés : {nodes}")

    print_board(board)
    winner = get_winner(board)
    if winner == "draw":
        print("Match nul !")
    else:
        print(f"{winner} a gagné !")

if __name__ == "__main__":
    play_game()