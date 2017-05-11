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
    'helpers' : new Helpers(),
    'initialize' : function() {
        let playerOptions = StartingOptions.playerOptions;
        let monsterOptions = StartingOptions.monsterOptions;
        if (this.initialGame) {
            this.gameSettings.soundOn = StartingOptions.audioOptions.soundOn;
            this.gameSettings.musicOn = StartingOptions.audioOptions.musicOn;
            this.gameSettings.difficulty = StartingOptions.uiOptions.difficulty;
            this.fbServices = new FirebaseServices();
            this.initialGame = false;
        }

        let audio = new Audio();
        let events = new Events();
        let ui = new UI(audio, events);
        let dungeon = new Dungeon(audio, ui);
        dungeon.createNewLevel();
        let players = {
            player1: new PlayerCharacter(playerOptions.player1, dungeon)
        };
        let monsters = {
            monster1 : new ElderMonster(monsterOptions.monster1, dungeon, audio)
        };
        let playerActions = new PlayerActions(dungeon, ui, players, monsters, audio);
        let monsterActions = new MonsterActions(dungeon, ui, players, monsters, audio);
        let turnController = new TurnController(dungeon, ui, players, playerActions, monsterActions, monsters, events);

        ui.initialize(turnController);

        turnController.initialize();
    }
};

$(Game.initialize());
