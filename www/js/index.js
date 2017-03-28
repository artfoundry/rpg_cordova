/**
 * Party RPG
 * Created by dsmarkowitz on 11/22/16.
 *
 * Instantiates major objects and events
 */

let game = {
    initialize: function() {
        const gridOptions = {
            width: 10,
            height: 10,
            tileSize: 64,
            difficulty: 'hard'
        };

        const playerOptions = {
            "player1" : {
                "name" : "Player1",
                "type" : "player",
                "subtype" : "investigator",
                "startPos" : "row1col1",
                "health" : 3
            }
        };

        const monsterOptions = {
            "monster1" : {
                "name" : "Elder",
                "type" : "elder",
                "subtype" : "monster",
                "health" : 3
            }
        };

        let helpers = new Helpers(gridOptions);
        let audio = new Audio();
        let events = new Events(helpers);
        let ui = new UI(audio, events);
        let grid = new Grid(helpers, gridOptions, audio, ui);
        let players = {
            player1: new PlayerCharacter(playerOptions.player1, grid, helpers)
        };
        let monsters = {
            monster1 : new ElderMonster(monsterOptions.monster1, grid, helpers)
        };
        let playerActions = new PlayerActions(grid, ui, players, monsters, helpers);
        let monsterActions = new MonsterActions(grid, ui, players, monsters, helpers);
        let turnController = new TurnController(grid, ui, players, playerActions, monsterActions, monsters, events);

        ui.initialize(turnController);

        turnController.initialize();
    }
};

$(game.initialize());
