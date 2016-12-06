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
                "playerName" : "Player1",
                "playerStart" : "row1col1"
            }
        };

        const monsterOptions = {
            "monster1" : {
                "monsterType" : "monster1"
            },
            "monster2" : {
                "monsterType" : "monster2"
            }
        };

        let grid = new Grid(gridOptions);
        let players = {
            player1: new PlayerCharacter(gridOptions, playerOptions.player1)
        };
        let monsters = {
            monster1 : new Monster(gridOptions, monsterOptions),
            monster2 : new Monster(gridOptions, monsterOptions)
        };
        let turnController = new TurnController(grid, players, monsters);

        grid.drawGrid();

        players.player1.initialize();

        monsters.monster1.initialize('monster-1');
        monsters.monster2.initialize('monster-2');

        turnController.initalize();
    }
};

$(app.initialize());
