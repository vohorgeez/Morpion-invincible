# Morpion invincible

Petit jeu de morpion (tic‑tac‑toe) en Python dans lequel l’ordinateur joue avec l’algorithme minimax.

## Prérequis
- Python 3.8 ou plus récent

## Comment jouer
1. Cloner ce dépôt.
2. Exécuter le programme :
   ```bash
   python tictactoe.py
   ```
3. Suivre les instructions : entrez un entier de 0 à 8 correspondant à la case où vous voulez placer votre « O ».

Les positions sont numérotées ainsi :
```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

## Fonctionnement
- Le joueur humain joue les « O » et commence.
- L’ordinateur joue les « X » et calcule son coup avec minimax, en évaluant chaque position possible pour ne jamais perdre.
- La partie se termine dès qu’il y a une victoire ou un match nul.

## Structure du code
- `tictactoe.py` : contient toute la logique du jeu (affichage, détection des lignes gagnantes, minimax et boucle de jeu).

## Idées d’amélioration
- Ajouter une interface graphique (Tkinter, Pygame, web).
- Gérer plusieurs niveaux de difficulté en limitant la profondeur de recherche.
- Proposer une option pour que l’ordinateur laisse le joueur commencer ou non.