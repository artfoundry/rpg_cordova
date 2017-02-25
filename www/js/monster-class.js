/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(monsterOptions, grid, helpers) {
        this.helpers = helpers;
        this.gridWidth = grid.gridWidth;
        this.gridHeight = grid.gridHeight;
        this.name = monsterOptions.name;
        this.type = monsterOptions.type;
        this.health = monsterOptions.health;
        this.row = 0;
        this.col = 0;
        this.pos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setmonster(this.pos);
    }

    randomMove(callback) {
        let direction = Math.round((Math.random() * 40) / 10),
            oldTileId = this.pos,
            newTileId = this.pos;

        switch (direction) {
            case 1:
                if ($('#row' + (this.row - 1) + 'col' + this.col).hasClass('walkable'))
                    newTileId = 'row' + (this.row - 1) + 'col' + this.col;
                break;
            case 2:
                if ($('#row' + this.row + 'col' + (this.col + 1)).hasClass('walkable'))
                    newTileId = 'row' + this.row + 'col' + (this.col + 1);
                break;
            case 3:
                if ($('#row' + (this.row + 1) + 'col' + this.col).hasClass('walkable'))
                    newTileId = 'row' + (this.row + 1) + 'col' + this.col;
                break;
            case 4:
                if ($('#row' + this.row + 'col' + (this.col - 1)).hasClass('walkable'))
                    newTileId = 'row' + this.row + 'col' + (this.col - 1);
                break;
        }
        this._setmonster(newTileId, oldTileId, callback);
    }

    _setmonster(newTileId, oldTileId, callback) {
        let monster = this,
            animatefadeInParams = {
                "position" : newTileId,
                "type" : "fadeIn",
                "callback" : function () {
                    if (callback)
                        callback();
                }
            },
            animatefadeOutParams = {
                "position" : oldTileId,
                "type" : "fadeOut",
                "callback" : function() {
                    monster.grid.changeTileImg(newTileId, monster.type);
                    monster.grid.changeTileImg(oldTileId, "clear");
                    monster.grid.animateTile(null, animatefadeInParams);
                }
            };

        if (oldTileId !== newTileId) {
            monster.grid.setTileWalkable(oldTileId, monster.name, monster.type);
            monster.grid.changeTileSetting(newTileId, monster.name, monster.type);
            monster.grid.animateTile(null, animatefadeOutParams);
        }

        monster.pos = newTileId;
        monster.row = this.helpers.getRowCol(newTileId).row;
        monster.col = this.helpers.getRowCol(newTileId).col;
    }

    _randomizeLoc() {
        let row = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3)),
            col = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));

        this.pos = 'row' + row + 'col' + col;
    }
}
