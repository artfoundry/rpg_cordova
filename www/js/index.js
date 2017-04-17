/**
 * Party RPG
 * Created by dsmarkowitz on 11/22/16.
 *
 * Instantiates major objects and events
 */

let Game = {
    'initialGame' : true,
    'gameSettings' : {},
    'fbServices' : {},
    'initialize' : function() {
        let gridOptions = startingOptions.gridOptions;
        let playerOptions = startingOptions.playerOptions;
        let monsterOptions = startingOptions.monsterOptions;
        if (this.initialGame) {
            this.gameSettings.soundOn = startingOptions.audioOptions.soundOn;
            this.gameSettings.musicOn = startingOptions.audioOptions.musicOn;
            this.gameSettings.difficulty = startingOptions.uiOptions.difficulty;
            this.initialGame = false;
            this.fbServices = new FirebaseServices();
        }

        let helpers = new Helpers(gridOptions);
        let audio = new Audio();
        let events = new Events(helpers);
        let ui = new UI(helpers, audio, events);
        let grid = new Grid(helpers, gridOptions, audio, ui);
        let players = {
            player1: new PlayerCharacter(playerOptions.player1, grid, helpers)
        };
        let monsters = {
            monster1 : new ElderMonster(monsterOptions.monster1, grid, helpers, audio)
        };
        let playerActions = new PlayerActions(grid, ui, players, monsters, helpers, audio);
        let monsterActions = new MonsterActions(grid, ui, players, monsters, helpers, audio);
        let turnController = new TurnController(grid, ui, players, playerActions, monsterActions, monsters, events);

        ui.initialize(turnController);

        turnController.initialize();
    }
};

$(Game.initialize());
