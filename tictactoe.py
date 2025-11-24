def create_board():
    return [" "]*9

def print_board(board):
    for i in range (3):
        start=3*i
        print(board[start], " | ", board[start+1], " | ", board[start+2])
        if i<2:
            print("---------------")

WIN_LINES = [
    (0,1,2), (3,4,5), (6,7,8), #lignes
    (0,3,6), (1,4,7), (2,5,8), #colonnes
    (0,4,8), (2,4,6) #diagonales
]

def has_won(board, player):
    for triplet in WIN_LINES:
        if board[triplet[0]] == board[triplet[1]] == board[triplet[2]] == player:
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
    legal_moves=[]
    for i in range (9):
        if board[i] == " ":
            legal_moves.append(i)
    return legal_moves

def evaluate(board):
    winner = get_winner(board)
    if winner == "X":
        return 1
    elif winner == "O":
        return -1
    elif winner == "draw":
        return 0
    else:
        return None
    
def minimax(board, is_maximizing):
    score = evaluate(board)
    if score is not None:
        return score
    legal_moves = get_legal_moves(board)
    if is_maximizing:
        best_score = -999
        for move in legal_moves:
            board[move] = "X"
            score=minimax(board, False)
            board[move] = " "
            if score > best_score:
                best_score = score
    else:
        best_score = 999
        for move in legal_moves:
            board[move] = "O"
            score=minimax(board, True)
            board[move] = " "
            if score < best_score:
                best_score = score
    return best_score

def choose_best_move(board):
    legal_moves=get_legal_moves(board)
    best_move = legal_moves[0]
    best_score = -999
    inspection = 0
    for move in legal_moves:
        board[move] = "X"
        inspection=minimax(board, False)
        board[move] = " "
        if inspection > best_score:
            best_move = move
            best_score = inspection
    return best_move

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
        legal_moves = get_legal_moves(board)
        if move in legal_moves:
            board[move] = "O"
            has_played=True
        else:
            print("Ce coup est impossible.")

def play_game():
    board = create_board()
    while get_winner(board) is None:
        human_turn(board)
        winner = get_winner(board)
        if winner is not None:
            break
        best_move = choose_best_move(board)
        board[best_move] = "X"
    print_board(board)
    winner=get_winner(board)
    if winner == "draw":
        print("Match nul !")
    else:
        print(f"{winner} a gagné !")

if __name__ == "__main__":
    play_game()