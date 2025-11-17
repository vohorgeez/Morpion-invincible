def create_board():
    return [" "]*9

def print_board(board):
    for i in range (3):
        start=3*i
        print(board[start], " | ", board[start+1], " | ", board[start+2])
        if i<2:
            print("-----------")

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
    """à compléter"""