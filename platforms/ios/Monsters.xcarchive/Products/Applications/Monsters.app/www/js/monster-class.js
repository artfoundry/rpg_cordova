/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(monsterOptions, dungeon, audio) {
        this.name = monsterOptions.name;
        this.type = monsterOptions.type;
        this.subtype = monsterOptions.subtype;
        this.health = monsterOptions.health; // used by player-actions for attacks
        this.currentLevel = monsterOptions.startingLevel;
        this.startingLocation = monsterOptions.location;
        this.questGoal = monsterOptions.questGoal || null;
        this.questName = monsterOptions.questName || null;
        this.dungeon = dungeon;
        this.grid = dungeon.grid;
        this.audio = audio;
        this.row = 0;
        this.col = 0;
        this.pos = '';
    }

    initialize() {
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
            targetPlayerLoc = {},
            rowDiff = 0,
            colDiff = 0,
            newTileId = this.pos,
            newTileRow = this.row,
            newTileCol = this.col,
            oldTileId = this.pos;

        // start searching from radius 2 because moveMonsters() already checks for players 1 space away to attack
        for (let radius=2; radius <= searchRadius; radius++) {
            $targets = $targets.add(Game.helpers.checkForNearbyCharacters(this, 'player', radius, this.grid.gridWidth, this.grid.gridHeight));
        }
        if ($targets.length === 0)
            this.randomMove();
        else {
            targetPlayerLoc = Game.helpers.getRowCol($targets[0].id);
            rowDiff = targetPlayerLoc.row - this.row;
            colDiff = targetPlayerLoc.col - this.col;
            if (Game.gameSettings.difficulty === 'medium') {
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
            } else if (Game.gameSettings.difficulty === 'hard') {
                this.moveRelatedToPlayer(targetPlayerLoc, 'toward');
            }
        }
    }

    avoidPlayer(playerTile, callback) {
        let targetPlayerLoc = Game.helpers.getRowCol(playerTile.id);

        this.moveRelatedToPlayer(targetPlayerLoc, 'away', callback);
    }

    moveRelatedToPlayer(targetPlayerLoc, direction, callback = null) {
        let modifier = direction === 'toward' ? 1 : -1,
            rowDiff = targetPlayerLoc.row - this.row,
            colDiff = targetPlayerLoc.col - this.col,
            options = [],
            newTileRow = this.row,
            newTileCol = this.col,
            oldTileId = this.pos,
            firstRowOpt,
            firstColOpt,
            $tileOption;

        // for each position of the target, there are three possible moves for the monster that will bring it closer
        // this is the best option
        if (this.row < targetPlayerLoc.row)
            newTileRow = this.row + modifier;
        else if (this.row > targetPlayerLoc.row)
            newTileRow = this.row - modifier;
        if (this.col < targetPlayerLoc.col)
            newTileCol = this.col + modifier;
        else if (this.col > targetPlayerLoc.col)
            newTileCol = this.col - modifier;
        options.push('row' + newTileRow + 'col' + newTileCol);
        firstRowOpt = newTileRow;
        firstColOpt = newTileCol;

        // this is the second best option (first option is blocked)
        if (Math.abs(rowDiff) > Math.abs(colDiff))
            if (colDiff === 0)
                newTileCol = this.col + modifier;
            else
                newTileCol = this.col;
        else
        if (rowDiff === 0)
            newTileRow = this.row + modifier;
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

        // for moving away, there are two extra options if the player is in a corner tile related to the monster
        if (direction === 'away' && rowDiff !== 0 && colDiff !== 0) {
            if (this.row < targetPlayerLoc.row)
                newTileRow = this.row - modifier;
            else if (this.row > targetPlayerLoc.row)
                newTileRow = this.row + modifier;
            if (this.col < targetPlayerLoc.col)
                newTileCol = this.col + modifier;
            else if (this.col > targetPlayerLoc.col)
                newTileCol = this.col - modifier;
            options.push('row' + newTileRow + 'col' + newTileCol);

            if (this.row < targetPlayerLoc.row)
                newTileRow = this.row + modifier;
            else if (this.row > targetPlayerLoc.row)
                newTileRow = this.row - modifier;
            if (this.col < targetPlayerLoc.col)
                newTileCol = this.col - modifier;
            else if (this.col > targetPlayerLoc.col)
                newTileCol = this.col + modifier;
            options.push('row' + newTileRow + 'col' + newTileCol);
        }

        for (let opt=0; opt < options.length; opt++) {
            $tileOption = $('#' + options[opt]);
            if ($tileOption.hasClass('walkable') && !$tileOption.hasClass('object') && !$tileOption.hasClass('item')) {
                this._setMonster(options[opt], oldTileId, callback);
                return;
            }
        }
        this.randomMove(callback);
    }

    randomMove(callback) {
        let direction = Math.floor(Math.random() * 4),
            oldTileId = this.pos,
            newTileId = this.pos,
            $tileOption;

        switch (direction) {
            case 0:
                $tileOption = $('#row' + (this.row - 1) + 'col' + this.col);
                if ($tileOption.hasClass('walkable') && !$tileOption.hasClass('object') && !$tileOption.hasClass('item'))
                    newTileId = 'row' + (this.row - 1) + 'col' + this.col;
                break;
            case 1:
                $tileOption = $('#row' + this.row + 'col' + (this.col + 1));
                if ($tileOption.hasClass('walkable') && !$tileOption.hasClass('object') && !$tileOption.hasClass('item'))
                    newTileId = 'row' + this.row + 'col' + (this.col + 1);
                break;
            case 2:
                $tileOption = $('#row' + (this.row + 1) + 'col' + this.col);
                if ($tileOption.hasClass('walkable') && !$tileOption.hasClass('object') && !$tileOption.hasClass('item'))
                    newTileId = 'row' + (this.row + 1) + 'col' + this.col;
                break;
            case 3:
                $tileOption = $('#row' + this.row + 'col' + (this.col - 1));
                if ($tileOption.hasClass('walkable') && !$tileOption.hasClass('object') && !$tileOption.hasClass('item'))
                    newTileId = 'row' + this.row + 'col' + (this.col - 1);
                break;
        }
        if (oldTileId !== newTileId)
            this._setMonster(newTileId, oldTileId, callback);
    }

    randomPos() {
        this.pos = Game.helpers.randomizeLoc(this.startingLocation, this.grid.gridWidth, this.grid.gridHeight);
    }

    _setMonster(newTileId, oldTileId, callback) {
        let monster = this,
            animateMoveParams = {},
            questName = monster.questGoal ? monster.questName : null;

        if (monster.currentLevel === monster.dungeon.currentLevel) {
            if (oldTileId) {
                animateMoveParams = {
                    "position" : oldTileId,
                    "destinationId" : newTileId,
                    "type" : "move",
                    "callback" : function() {
                        monster.audio.playSoundEffect(['move-' + monster.subtype], .5);
                        monster.grid.changeTileImg(newTileId, '.character', 'character-' + monster.subtype);
                        monster.grid.changeTileImg(oldTileId, '.character', '', 'character-' + monster.subtype);
                        if (callback)
                            callback();
                    }
                };
                monster.grid.setTileWalkable(oldTileId, monster.name, monster.type, monster.subtype);
                monster.grid.changeTileSetting(newTileId, monster.name, monster.type, monster.subtype, questName);
                monster.grid.animateTile(animateMoveParams);
                monster.pos = newTileId;
            } else {
                animateMoveParams = {
                    "position" : newTileId,
                    "tileLayer" : ".character",
                    "type" : "spawn",
                    "addClasses" : "character-" + monster.subtype,
                    "removeClasses" : null
                };
                monster.grid.changeTileSetting(newTileId, monster.name, monster.type, monster.subtype, questName);
                monster.grid.animateTile(animateMoveParams);
            }

            monster.row = Game.helpers.getRowCol(newTileId).row;
            monster.col = Game.helpers.getRowCol(newTileId).col;
        }
    }
}
