import unittest

from engine import (
    create_board,
    has_won,
    get_winner,
    get_legal_moves,
    evaluate_terminal,
    choose_best_move,
    reset_node_counter,
    get_node_counter,
)

class TestTicTacToe(unittest.TestCase):

    def test_empty_board_legal_moves(self):
        board = create_board()
        self.assertEqual(get_legal_moves(board), list(range(9)))

    def test_has_won_rows_cols_diags(self):
        # Row
        board = ["X", "X", "X", " ", " ", " ", " ", " ", " "]
        self.assertTrue(has_won(board, "X"))

        # Column
        board = ["O", " ", " ", "O", " ", " ", "O", " ", " "]
        self.assertTrue(has_won(board, "O"))

        # Diagonal
        board = ["X", " ", " ",
                 " ", "X", " ",
                 " ", " ", "X"]
        self.assertTrue(has_won(board, "X"))

    def test_get_winner_and_evaluate_terminal(self):
        # X wins
        board = ["X", "X", "X", "O", "O", " ", " ", " ", " "]
        self.assertEqual(get_winner(board), "X")
        self.assertEqual(evaluate_terminal(board), 1)

        # O wins
        board = ["O", "O", "O", "X", "X", " ", " ", " ", " "]
        self.assertEqual(get_winner(board), "O")
        self.assertEqual(evaluate_terminal(board), -1)

        # Draw
        board = ["X", "O", "X",
                 "X", "O", "O",
                 "O", "X", "X"]
        self.assertEqual(get_winner(board), "draw")
        self.assertEqual(evaluate_terminal(board), 0)

        # Non-terminal
        board = ["X", "O", "X",
                 " ", "O", " ",
                 " ", "X", " "]
        self.assertIsNone(get_winner(board))
        self.assertIsNone(evaluate_terminal(board))

    def test_first_move_is_center_and_optimal(self):
        board = create_board()
        move = choose_best_move(board)
        self.assertEqual(move, 4)

    def test_node_counter_increments(self):
        board = create_board()
        reset_node_counter()
        _ = choose_best_move(board)
        self.assertGreater(get_node_counter(), 0)

if __name__ == "__main__":
    unittest.main()