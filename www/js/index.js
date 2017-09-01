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
    'items' : ITEMS,
    'quests' : QUESTS,
    'platform' : '',
    'getOS' : function() {
        let userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return (os === 'iOS' || os === 'Android') ? 'mobile' : 'desktop';
    },
    'initialize' : function() {
        let startingMap = StartingOptions.startingMap;
        let playerOptions = startingMap.playerOptions;
        if (this.initialGame) {
            this.platform = this.getOS();
            this.gameSettings.soundOn = StartingOptions.audioOptions.soundOn;
            this.gameSettings.musicOn = StartingOptions.audioOptions.musicOn;
            this.gameSettings.difficulty = StartingOptions.uiOptions.difficulty;
            this.fbServices = new FirebaseServices();
            this.initialGame = false;
        }

        let audio = new Audio();
        let events = new Events();
        let ui = new UI(audio, events);
        let dungeon = new Dungeon(startingMap, audio, ui);
        if (!this.initialGame)
            dungeon.clearGrid();
        dungeon.createLevel(startingMap.levels[0]);

        let players = {
            'player1': new PlayerCharacter(playerOptions.player1, dungeon)
        };
        let monsters = dungeon.createMonstersForLevel();
        let playerActions = new PlayerActions(dungeon, ui, players, monsters, audio);
        let monsterActions = new MonsterActions(dungeon, ui, players, monsters, audio);
        let turnController = new TurnController(dungeon, ui, players, playerActions, monsterActions, monsters, events);

        ui.initialize();
        turnController.initialize();
    }
};

// for testing
function lighting() { $('#canvas-lighting').toggle(); }

$(Game.initialize());
