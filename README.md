# Morpion invincible

Version 2 – Performance & "propreté".

Petit jeu de morpion (tic-tac-toe) en Python dans lequel l'IA ne perd jamais grâce à un minimax exhaustif optimisé.

## Nouveautés v2
- Minimax avec alpha-beta pruning : ordre de jeu centre > coins > bords pour optimiser l'élagage.
- Compteur de nœuds visités exposé par l'API (et affiché dans le CLI).
- Structure API propre dans `engine.py` (`create_board`, `get_winner`, `get_legal_moves`, `make_ai_move`, etc.).
- Évaluation zéro-heuristique (uniquement les positions terminales comptent) + test vérifiant que le premier coup optimal est bien le centre.
- CLI : choix `IA commence / joueur commence`, validation des entrées et messages d'erreur clairs.
- Suite de tests unitaires (`test_tictactoe.py`) couvrant les fonctions cœur et le compteur de nœuds.

## Prérequis
- Python 3.8 ou plus récent

## Installation
1. Cloner ce dépôt.
2. (Optionnel) Créer un environnement virtuel.
3. Pas de dépendances externes : la bibliothèque standard suffit.

## Comment jouer
1. Lancez le CLI :
   ```bash
   python cli.py
   ```
2. Choisissez qui commence (joueur = O, IA = X). Le choix est redemandé tant que l'entrée n'est pas 1/2.
3. Jouez en entrant un entier entre 0 et 8 correspondant à la case où placer votre O. Les entrées non numériques ou hors plateau sont refusées et expliquées.

Repère des cases :
```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

Après chaque coup de l'IA, le programme affiche la position jouée et le nombre de nœuds explorés pendant la recherche. La partie s'arrête automatiquement lorsque quelqu'un gagne ou en cas de match nul.

## Structure
- `engine.py` : logique de morpion, évaluation terminale, minimax + alpha-beta, compteur de nœuds et petite API (`make_ai_move`, `apply_move`, ...).
- `cli.py` : boucle de jeu interactive, choix du premier joueur, validation des entrées, affichage des plateaux et du compteur.
- `test_tictactoe.py` : tests unitaires sur les fonctions cœur (`has_won`, `get_winner`, `evaluate_terminal`, `choose_best_move`, compteur de nœuds).

Tous les modules sont importables, ce qui permet d'utiliser l'IA dans d'autres frontaux (web, GUI, etc.).

## Tests
Lancer la suite :
```bash
python -m unittest
```
Les tests valident notamment :
- les fonctions de base (lignes gagnantes, coups légaux, évaluation terminale),
- l'absence d'heuristique (seules les fins de partie ont une note),
- que le premier coup optimal est toujours le centre,
- et que le compteur de nœuds s'incrémente bien pendant la recherche.

## Idées pour la suite
- Ajout d'un mode graphique (Tkinter, Pygame, web).
- Personnalisation de la profondeur de recherche pour simuler des niveaux de difficulté.
- Export de statistiques (temps de calcul, histogramme des nœuds) pour analyser les performances.
