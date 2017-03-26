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
        this.subtype = monsterOptions.subtype;
        this.health = monsterOptions.health;
        this.row = 0;
        this.col = 0;
        this.pos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setMonster(this.pos);
    }

    /**
     * function searchForPrey
     * Currently looks for player within searchRadius and if finds them, moves toward the first one as long as the tile is walkable
     *
     * @param searchRadius: the distance in tiles from the monster to search
     */
    searchForPrey(searchRadius) {
        let targets = this.helpers.checkForNearbyCharacters(this, 'player', searchRadius),
            targetPlayer = {},
            rowDiff = 0,
            colDiff = 0,
            newTileId = this.pos,
            newTileRow = this.row,
            newTileCol = this.col,
            oldTileId = this.pos;

        if (targets !== null) {
            targetPlayer = this.helpers.getRowCol(targets[0].id);
            rowDiff = targetPlayer.row - this.row;
            colDiff = targetPlayer.col - this.col;
            if (Math.abs(rowDiff) === searchRadius || Math.abs(colDiff) === searchRadius) {
                if (Math.abs(rowDiff) > 0) {
                    newTileRow = rowDiff < 0 ? this.row - 1 : this.row + 1;
                }
                if (Math.abs(colDiff) > 0) {
                    newTileCol = colDiff < 0 ? this.col - 1 : this.col + 1;
                }
                newTileId = 'row' + newTileRow + 'col' + newTileCol;
                if ($('#' + newTileId).hasClass('walkable'))
                    this._setMonster(newTileId, oldTileId);
            }
        } else {
            this.randomMove();
        }
    }

    randomMove(callback) {
        let direction = Math.floor(Math.random() * 4),
            oldTileId = this.pos,
            newTileId = this.pos;

        switch (direction) {
            case 0:
                if ($('#row' + (this.row - 1) + 'col' + this.col).hasClass('walkable'))
                    newTileId = 'row' + (this.row - 1) + 'col' + this.col;
                break;
            case 1:
                if ($('#row' + this.row + 'col' + (this.col + 1)).hasClass('walkable'))
                    newTileId = 'row' + this.row + 'col' + (this.col + 1);
                break;
            case 2:
                if ($('#row' + (this.row + 1) + 'col' + this.col).hasClass('walkable'))
                    newTileId = 'row' + (this.row + 1) + 'col' + this.col;
                break;
            case 3:
                if ($('#row' + this.row + 'col' + (this.col - 1)).hasClass('walkable'))
                    newTileId = 'row' + this.row + 'col' + (this.col - 1);
                break;
        }
        if (oldTileId !== newTileId)
            this._setMonster(newTileId, oldTileId, callback);
    }

    _setMonster(newTileId, oldTileId, callback) {
        let monster = this,
            animateMoveParams = {};

        if (oldTileId) {
            animateMoveParams = {
                "position" : oldTileId,
                "destinationId" : newTileId,
                "type" : "move",
                "callback" : function() {
                    monster.grid.changeTileImg(newTileId, 'content-' + monster.type, 'content-trans');
                    monster.grid.changeTileImg(oldTileId, 'content-trans', 'content-' + monster.type);
                    if (callback)
                        callback();
                }
            };
            monster.grid.setTileWalkable(oldTileId, monster.name, monster.type, monster.subtype);
            monster.grid.changeTileSetting(newTileId, monster.name, monster.type, monster.subtype);
            monster.grid.animateTile(animateMoveParams);
            monster.pos = newTileId;
        } else {
            animateMoveParams = {
                "position" : newTileId,
                "type" : "spawn",
                "addClasses" : "content-" + monster.type,
                "removeClasses" : "content-trans"
            };
            monster.grid.changeTileSetting(newTileId, monster.name, monster.type, monster.subtype);
            monster.grid.animateTile(animateMoveParams);
        }

        monster.row = this.helpers.getRowCol(newTileId).row;
        monster.col = this.helpers.getRowCol(newTileId).col;
    }

    _randomizeLoc() {
        let row = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3)),
            col = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));

        this.pos = 'row' + row + 'col' + col;
    }
}
