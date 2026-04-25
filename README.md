# Morpion invincible

Version 4 - Polish & Extensions

Petit jeu de morpion (tic-tac-toe) avec une IA invincible en mode parfait, basee sur un minimax exhaustif avec alpha-beta.

## Nouveautés v4 (en cours)
- Move ordering
- Transposition table

## Nouveautés v3
- Interface web autonome (HTML/CSS/JS) avec grille cliquable.
- Deux modes : Facile (aleatoire) et Parfait (minimax).
- Choix du joueur qui commence (humain ou IA).
- Statistiques affichees : temps de calcul et noeuds explores.
- Theme clair/sombre et surlignage de la ligne gagnante.

## Série d'articles
- [1/6 - Un jeu trivial ?](https://www.mathieuvergez.com/post/morpion-invincible-1-6-un-jeu-trivial)
- [2/6 - La modélisation du jeu](https://www.mathieuvergezcom/post/morpion-invincible-2-6-la-modélisation-du-jeu)
- [3/6 - Minimax](https://www.mathieuvergez.com/post/morpion-invincible-3-6-minimax)
- [4/6 - Alpha-beta](https://www.mathieuvergez.com/post/morpion-invincible-4-6-alpha-beta-ou-comment-l-ia-arrête-de-réfléchir-pour-rien)
- [5/6 - Du terminal au navigateur](https://www.mathieuvergez.com/post/morpion-invincible-5-6-du-terminal-au-navigateur)
- 6/6 - *en cours d'écriture*

## Prerequis
- Pour le web : un navigateur moderne (aucun serveur requis).
- Pour le CLI Python : Python 3.8 ou plus recent.

## Installation
1. Cloner ce depot.
2. (Optionnel) Creer un environnement virtuel.
3. Pas de dependances externes.

## Jouer (web)
Ouvrir `index.html` dans un navigateur.

## Jouer (CLI Python)
1. Lancer :
   ```bash
   python cli.py
   ```
2. Choisir qui commence (joueur = O, IA = X).
3. Jouer en entrant un entier entre 0 et 8 correspondant a la case.

Repere des cases :
```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

Apres chaque coup de l'IA, le CLI affiche la position jouee et le nombre de noeuds explores. La partie s'arrete automatiquement lorsqu'il y a un gagnant ou un match nul.

## Structure
- `index.html` : page du jeu web.
- `style.css` : styles (theme clair/sombre, grille, surlignage).
- `script.js` : logique du jeu, minimax, UI, stats et choix du mode.
- `engine.py` : logique du morpion et API minimax pour le CLI.
- `cli.py` : boucle de jeu interactive.
- `test_tictactoe.py` : tests unitaires des fonctions coeur.

Tous les modules sont importables, ce qui permet d'utiliser l'IA dans d'autres frontaux (web, GUI, etc.).

## Tests
Lancer la suite :
```bash
python -m unittest
```
Les tests valident notamment :
- les fonctions de base (lignes gagnantes, coups legaux, evaluation terminale),
- l'absence d'heuristique (seules les fins de partie ont une note),
- que le premier coup optimal est toujours le centre,
- et que le compteur de noeuds s'incremente pendant la recherche.