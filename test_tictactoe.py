import unittest

from engine import (
    create_board,
    has_won,
    get_winner,
    get_available_moves,
    evaluate,
    choose_best_move,
    reset_node_counter,
    get_node_counter,
    is_valid_move,
    EMPTY,
    AI,
    HUMAN
)

class TestTicTacToe(unittest.TestCase):

    def test_empty_board_legal_moves(self):
        board = create_board()
        self.assertEqual(get_available_moves(board), list(range(9)))

    def test_has_won_rows_cols_diags(self):
        # Row
        board = [AI, AI, AI, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
        self.assertTrue(has_won(board, "X"))

        # Column
        board = [HUMAN, EMPTY, EMPTY, HUMAN, EMPTY, EMPTY, HUMAN, EMPTY, EMPTY]
        self.assertTrue(has_won(board, "O"))

        # Diagonal
        board = [AI, EMPTY, EMPTY,
                 EMPTY, AI, EMPTY,
                 EMPTY, EMPTY, AI]
        self.assertTrue(has_won(board, AI))

    def test_get_winner_and_evaluate(self):
        # X wins
        board = [AI, AI, AI, HUMAN, HUMAN, EMPTY, EMPTY, EMPTY, EMPTY]
        self.assertEqual(get_winner(board), "X")
        self.assertEqual(evaluate(board), 1)

        # O wins
        board = [HUMAN, HUMAN, HUMAN, AI, AI, EMPTY, EMPTY, EMPTY, EMPTY]
        self.assertEqual(get_winner(board), "O")
        self.assertEqual(evaluate(board), -1)

        # Draw
        board = [AI, HUMAN, AI,
                 AI, HUMAN, HUMAN,
                 HUMAN, AI, AI]
        self.assertEqual(get_winner(board), "draw")
        self.assertEqual(evaluate(board), 0)

        # Non-terminal
        board = [AI, HUMAN, AI,
                 EMPTY, HUMAN, EMPTY,
                 EMPTY, AI, EMPTY]
        self.assertIsNone(get_winner(board))
        self.assertIsNone(evaluate(board))

    def test_first_move_is_center_and_optimal(self):
        board = create_board()
        move = choose_best_move(board)
        self.assertEqual(move, 4)

    def test_node_counter_increments(self):
        board = create_board()
        reset_node_counter()
        _ = choose_best_move(board)
        self.assertGreater(get_node_counter(), 0)

    def test_a_valid_move(self):
        board = create_board()
        self.assertTrue(is_valid_move(board, 0))

    def test_an_invalid_move(self):
        board = create_board()
        board[0] = "X"
        self.assertFalse(is_valid_move(board, 0))

if __name__ == "__main__":
    unittest.main()