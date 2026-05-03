from engine import minimax_pure, create_board
import json

table = {}
board = create_board()
minimax_pure(board, True, table)
minimax_pure(board, False, table)

with open("table.json", "w") as json_file:
    json.dump(table, json_file)