import time
import engine
from engine import (
    create_board,
    get_available_moves,
    ordered_legal_moves,
    minimax_pure,
    minimax_ab,
    reset_node_counter,
    get_node_counter,
    AI, HUMAN, EMPTY,
)

def best_move_pure(board):
    reset_node_counter()
    best_score = float("-inf")
    best = get_available_moves(board)[0]
    for move in get_available_moves(board):
        board[move] = AI
        score = minimax_pure(board, False)
        board[move] = EMPTY
        if score > best_score:
            best_score = score
            best = move
    return best, get_node_counter()

def best_move_ab(board):
    reset_node_counter()
    best_score = float("-inf")
    best = ordered_legal_moves(board)[0]
    for move in ordered_legal_moves(board):
        board[move] = AI
        score = minimax_ab(board, False, float("-inf"), float("inf"))
        board[move] = EMPTY
        if score > best_score:
            best_score = score
            best = move
    return best, get_node_counter()

def run_bench(label, board):
    print(f"\n{'-' * 52}")
    print(f"    {label}")
    print(f"    Plateau : {board}")

    t0 = time.perf_counter()
    move_pure, nodes_pure = best_move_pure(board[:])
    t_pure = (time.perf_counter() - t0) * 1000

    t0 = time.perf_counter()
    move_ab, nodes_ab = best_move_ab(board[:])
    t_ab = (time.perf_counter() - t0) * 1000

    gain_nodes = (1 - nodes_ab / nodes_pure) * 100
    gain_time = (1 - t_ab / t_pure) * 100

    print(f"    {'':22} {'Minimax pur':>10} {'Alpha-beta':>10}")
    print(f"    {'Noeuds visités':22} {nodes_pure:>10,} {nodes_ab:>10,}")
    print(f"    {'Temps (ms)':22} {t_pure:>10.2f} {t_ab:>10.2f}")
    print(f"    {'Coup choisi':22} {move_pure:>10} {move_ab:>10}")
    print(f"    -> Alpha-beta économise {gain_nodes:.0f}% des noeuds, {gain_time:.0f}% du temps")

if __name__ == "__main__":
    print("=" * 52)
    print(" BENCHMARK : Minimax pur vs Alpha-beta")
    print("=" * 52)

    # Plateau vide - pire cas résolu
    run_bench("Plateau vide (pire cas)", create_board())

    # Un coup joué - X au centre
    b1 = create_board()
    b1[4] = AI
    run_bench("X au centre, 8 cases libres", b1)

    # Mi-partie - 4 coups joués
    b2 = [AI, HUMAN, EMPTY,
          EMPTY, AI, EMPTY,
          HUMAN, EMPTY, EMPTY]
    run_bench("Mi-partie (4 coups joués)", b2)

    # Fin proche - 6 coups joués
    b3 = [AI, HUMAN, AI,
          HUMAN, AI, EMPTY,
          EMPTY, EMPTY, HUMAN]
    run_bench("Fin proche (6 coups joués)", b3)

    print(f"\n{'=' * 52}")
    print(" Ces chiffres seront la colonne vertébrale de l'Article 4.")
    print("=" * 52)