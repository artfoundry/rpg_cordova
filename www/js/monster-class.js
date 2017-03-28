/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(monsterOptions, grid, helpers) {
        this.helpers = helpers;
        this.gridWidth = grid.gridWidth;
        this.gridHeight = grid.gridHeight;
        this.difficulty = grid.difficulty;
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
     * Currently looks for players within searchRadius and if finds them, tries three possible tiles
     * to move toward the first one. If none are walkable, then stays put. If none are found, moves randomly.
     *
     * @param searchRadius: the distance in tiles from the monster to search (will search everything from 2 tiles away up to search radius
     */
    searchForPrey(searchRadius) {
        let $targets = $(),
            targetPlayer = {},
            rowDiff = 0,
            colDiff = 0,
            options = [],
            newTileId = this.pos,
            newTileRow = this.row,
            newTileCol = this.col,
            firstRowOpt = 0,
            firstColOpt = 0,
            oldTileId = this.pos;

        // start searching from radius 2 because moveMonsters() already checks for players 1 space away to attack
        for (let radius=2; radius <= searchRadius; radius++) {
            $targets = $targets.add(this.helpers.checkForNearbyCharacters(this, 'player', radius));
        }
        if ($targets.length === 0)
            this.randomMove();
        else {
            targetPlayer = this.helpers.getRowCol($targets[0].id);
            rowDiff = targetPlayer.row - this.row;
            colDiff = targetPlayer.col - this.col;
            if (this.difficulty === 'medium') {
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
            } else if (this.difficulty === 'hard') {
                // for each position of the target, there are three possible moves for the monster that will bring it closer
                // this is the best option
                if (this.row < targetPlayer.row)
                    newTileRow = this.row + 1;
                else if (this.row > targetPlayer.row)
                    newTileRow = this.row - 1;
                if (this.col < targetPlayer.col)
                    newTileCol = this.col + 1;
                else if (this.col > targetPlayer.col)
                    newTileCol = this.col - 1;
                options.push('row' + newTileRow + 'col' + newTileCol);
                firstRowOpt = newTileRow;
                firstColOpt = newTileCol;

                // this is the second best option (first option is blocked)
                if (rowDiff > colDiff)
                    if (colDiff === 0)
                        newTileCol = this.col + 1;
                    else
                        newTileCol = this.col;
                else
                    if (rowDiff === 0)
                        newTileRow = this.row + 1;
                    else
                        newTileRow = this.row;
                options.push('row' + newTileRow + 'col' + newTileCol);

                // this is the last option - basically the reverse of the 2nd option
                if (newTileRow === this.row) {
                    newTileRow = firstRowOpt;
                    newTileCol = this.col;
                } else if (newTileCol === this.col) {
                    newTileCol = firstColOpt;
                    newTileRow = this.row;
                }
                options.push('row' + newTileRow + 'col' + newTileCol);

                for (let opt=0; opt < options.length; opt++) {
                    if ($('#' + options[opt]).hasClass('walkable')) {
                        this._setMonster(options[opt], oldTileId);
                        break;
                    }
                }
            }
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
