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
                "health" : 3,
                "image" : "character-color.png"
            }
        };

        const monsterOptions = {
            "monster1" : {
                "name" : "Queen",
                "health" : 3,
                "image" : "Queen.png"
            }
        };

        let helpers = new Helpers(gridOptions);
        let grid = new Grid(gridOptions, helpers);
        let events = new Events();
        let ui = new UI(events);
        let players = {
            player1: new PlayerCharacter(playerOptions.player1, helpers)
        };
        let monsters = {
            monster1 : new QueenMonster(grid, gridOptions, monsterOptions.monster1, helpers)
        };
        let playerActions = new PlayerActions(grid, ui, players, monsters, helpers);
        let monsterActions = new MonsterActions(grid, ui, players, monsters, helpers);
        let turnController = new TurnController(grid, ui, players, playerActions, monsterActions, monsters, events);

        ui.initialize(turnController);

        turnController.initialize();
    }
};

$(app.initialize());
