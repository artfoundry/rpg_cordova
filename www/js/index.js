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
            height: 10,
            playerStart: 'row1col1'
        };

        let grid = new Grid(gridOptions);
        let player = new PlayerCharacter(gridOptions);
        let monsters = {
            monster1 : new Monster(gridOptions),
            monster2 : new Monster(gridOptions)
        };
        let events = new Events();
        let turnController = new TurnController(monsters);

        grid.drawGrid();
        events.setUpTileChangeListener('.tile', grid.updateTileImage);
        events.setUpLightChangeListener('.tile', grid.updateLightingImage);

        player.initialize();
        events.setUpClickListener('.tile', player.movePlayer, player, turnController);

        monsters.monster1.initialize('monster-1');
        monsters.monster2.initialize('monster-2');
    }
};

$(app.initialize());
