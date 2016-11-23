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
            playerStart: 1
        };

        var grid = new Grid(gridOptions);
        var player = new PlayerCharacter(gridOptions);
        var events = new Events();

        grid.drawGrid();
        events.setUpTileChangeListener('.tile', grid.updateTileImage);

        player.initialize();
        events.setUpClickListener('.tile', player.movePlayer, player);
    }
};

$(app.initialize());
