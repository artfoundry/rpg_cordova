# Monsters! (rpg_cordova)
A Lovecraft themed turn based RPG using cordova for mobile.

Built using only HTML5, CSS3, JS (Ecmasript 6), and JQuery. Designed with object oriented programming in mind from the start to allow for
flexibility and expandability.

Development schedule is in phases:

**Phase 1: First and simplest MVP**

Just one character and one monster, in which player and monster take turns. One tile per move and one hit kill.
Player controls by clicking on tile around character. Monster moves randomly but attacks player if it's one tile away.
Game ends when either player or monster is dead.

*Completed*

**Phase 2: First actual game**

One character with two types of monsters, an Elder Thing and Shoggoths. The Elder moves one tile at a time in random direction
and spawns a Shoggoth each turn it can move but can't attack. Shoggoths move one tile at a time in random direction
and attacks player if next to it. All monsters move after player moves. Game ends when either player or all monsters are dead.  Scoring is based on remaining health and number of kills at end of game.

*Completed*

**Phase 3: Expanded features**

Addition of inventory and quests/tasks. An Elder Sign artifact is placed randomly in the room, and the player must acquire it before being able to damage the Elder Thing. Acquiring the artifact adds to the score and killing the Elder further adds to the score. Addition of randomly generated walls. Addition of leaderboards and difficulty levels.

*Completed*

**Phase 4: More advanced game**

Addition of player insanity, reduced by being near and interacting with monsters. If sanity reaches 0, game over. Addition of multiple dungeon levels, each with different tasks:

1) First level: Kill monsters (only Shoggoths, no Elders)
2) Second level: Find Elder Sign (only Shoggoths, no Elders)
3) Third level: Kill Elder and any Shoggoths (one Elder)

*Completed*

**Phase 4a: Compiling with Cordova for native mobile**

Use Cordova to compile native apps for iOS and Google Play app stores.  Need to create app icon and splash screen.  Need Restart Game button in Options panel so user doesn't need to restart app.

*In progress*

**Phase 5: More RPG elements added**

At this point, the game will likely become a separate entity with a new name (and its own domain/web site), goal shifting from score to adventure completion, more advanced UI, and more complexity.

Features uncertain, but possibilities include character stats, character skills, more items, more monster types, multiple dungeons (with outdoor area)

**Phase 6: Multiplayer?** (Tentative)
