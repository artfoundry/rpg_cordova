/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(grid, gridOptions, monsterOptions, helpers) {
        this.grid = grid;
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.name = monsterOptions.name;
        this.image = monsterOptions.image;
        this.health = monsterOptions.health;
        this.helpers = helpers;
        this.row = 0;
        this.col = 0;
        this.pos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setMonster(this.pos);
    }

    randomMove() {
        let direction = Math.floor((Math.random() * 40) / 10),
            oldTileId = this.pos,
            newTileId = '',
            monster = this;

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

        if (newTileId !== '') {
            this.grid.animateTile(null, {targetObject: monster, type: 'move', destinationId: newTileId, callback: function() {
                monster._setMonster(newTileId, oldTileId);
            }});
        }

    }

    _setMonster(newTileId, oldTileId) {
        if (oldTileId) {
            $('#' + oldTileId)
                .addClass('walkable')
                .trigger('tileChange', [this.name, '<img class="content" src="img/trans.png">'])
                .removeClass(this.name + ' monster');
        }

        $('#' + newTileId)
            .addClass(this.name + ' monster')
            .trigger('tileChange', [this.name, '<img class="content" src="img/' + this.image + '">'])
            .removeClass('walkable');

        this.row = this.helpers.getRowCol(newTileId).row;
        this.col = this.helpers.getRowCol(newTileId).col;
        this.pos = newTileId;
    }

    _randomizeLoc() {
        let row = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3)),
            col = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));

        this.pos = 'row' + row + 'col' + col;
    }
}
