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

        var grid = new Grid(gridOptions);
        var player = new PlayerCharacter(gridOptions);
        var monster1 = new Monster(gridOptions);
        var monster2 = new Monster(gridOptions);
        var events = new Events();

        grid.drawGrid();
        events.setUpTileChangeListener('.tile', grid.updateTileImage);
        events.setUpLightChangeListener('.tile', grid.updateLightingImage);

        player.initialize();
        events.setUpClickListener('.tile', player.movePlayer, player);

        monster1.initialize('monster-1');
        monster2.initialize('monster-2');
    }
};

$(app.initialize());
