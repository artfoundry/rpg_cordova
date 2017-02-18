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
                "targetObject" : monster,
                "type" : "fadeIn",
                "callback" : function () {
                    if (callback)
                        callback();
                }
            },
            animatefadeOutParams = {
                "targetObject" : monster,
                "type" : "fadeOut",
                "callback" : function() {
                    if (oldTileId)
                        monster.grid.clearImg(monster);
                    monster.pos = newTileId;
                    $('#' + newTileId).addClass(monster.name + ' monster').removeClass('walkable');
                    $('#' + newTileId + ' .content').attr('class', 'content content-' + monster.type);
                    monster.grid.animateTile(null, animatefadeInParams);
                }
            };

        this.grid.animateTile(null, animatefadeOutParams);

        this.row = this.helpers.setRowCol(newTileId).row;
        this.col = this.helpers.setRowCol(newTileId).col;
    }

    _randomizeLoc() {
        let row = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3)),
            col = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));

        this.pos = 'row' + row + 'col' + col;
    }
}
