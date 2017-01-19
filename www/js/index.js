/**
 * Party RPG
 * Created by dsmarkowitz on 11/22/16.
 *
 * Instantiates major objects and events
 */

var app = {
    initialize: function() {
        const gridOptions = {
            width: 10,
            height: 10
        };

        const playerOptions = {
            "player1" : {
                "name" : "Player1",
                "startPos" : "row1col1",
                "health" : 1
            }
        };

        const monsterOptions = {
            "monster1" : {
                "monsterType" : "Monster1",
                "health" : 1
            },
            "monster2" : {
                "monsterType" : "Monster2",
                "health" : 1
            }
        };

        let grid = new Grid(gridOptions);
        let helpers = new Helpers(grid);
        let ui = new UI();
        let players = {
            player1: new PlayerCharacter(gridOptions, playerOptions.player1, helpers)
        };
        let monsters = {
            monster1 : new Monster(gridOptions, monsterOptions.monster1),
            monster2 : new Monster(gridOptions, monsterOptions.monster2)
        };
        let turnController = new TurnController(grid, ui, players, monsters, helpers);

        grid.drawGrid();

        turnController.initialize();
        turnController.runTurnCycle();

        players.player1.initialize();

        monsters.monster1.initialize();
        monsters.monster2.initialize();
    }
};

$(app.initialize());
