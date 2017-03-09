# rpg_cordova
A Lovecraft themed turn based RPG using cordova for mobile.

Built using only HTML5, CSS3, JS (Ecmasript 6), and JQuery. Designed with object oriented programming in mind from the start to allow for
flexibility and expandability.

Development schedule is in phases:

**Phase 1: First and simplest MVP**

Just one character and one monster, in which player and monster take turns.  One tile per move and one hit kill.
Player controls by clicking on tile around character. Monster moves randomly but attacks player if it's one tile away.
Game ends when either player or monster is dead.

*Completed*

**Phase 2: First actual game**

One character with two types of monsters, an Elder Thing and Shoggoths.  The Elder moves one tile at a time in random direction
and spawns a Shoggoth each turn it can move but can't attack. Shoggoths move one tile at a time in random direction
and attacks player if next to it.  All monsters move after player moves.
Game ends when either player or all monsters are dead.  Scoring is based on remaining health and number of kills at end of game.

*In progress*

**Phase 2a: Expanded features**

An Elder Sign artifact is placed randomly in the room, and the player must acquire it before being able to damage the Elder Thing. Acquiring the artifact adds to the score and killing the Elder further adds to the score.
Addition of walls/other barriers, possibly randomly generated.

**Phase 3: More advanced game** (features not finalized)
