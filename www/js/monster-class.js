/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(gridOptions, monsterOptions, helpers) {
        this.helpers = helpers;
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.name = monsterOptions.name;
        this.type = monsterOptions.type;
        this.health = monsterOptions.health;
        this.row = 0;
        this.col = 0;
        this.pos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setmonster();
    }

    randomMove() {
        let direction = Math.round((Math.random() * 40) / 10),
            oldTileId = this.pos;

        switch (direction) {
            case 1:
                if ($('#row' + (this.row - 1) + 'col' + this.col).hasClass('walkable'))
                    this.pos = 'row' + (this.row - 1) + 'col' + this.col;
                break;
            case 2:
                if ($('#row' + this.row + 'col' + (this.col + 1)).hasClass('walkable'))
                    this.pos = 'row' + this.row + 'col' + (this.col + 1);
                break;
            case 3:
                if ($('#row' + (this.row + 1) + 'col' + this.col).hasClass('walkable'))
                    this.pos = 'row' + (this.row + 1) + 'col' + this.col;
                break;
            case 4:
                if ($('#row' + this.row + 'col' + (this.col - 1)).hasClass('walkable'))
                    this.pos = 'row' + this.row + 'col' + (this.col - 1);
                break;
        }
        this._setmonster(oldTileId);
    }

    _setmonster(oldTileId) {
        if (oldTileId) {
            $('#' + oldTileId).addClass('walkable').removeClass(this.name + ' monster');
            $('#' + oldTileId + ' .content').attr('class', 'content content-trans');
        }

        $('#' + this.pos).addClass(this.name + ' monster').removeClass('walkable');
        $('#' + this.pos + ' .content').attr('class', 'content content-' + this.type);

        this.row = this.helpers.setRowCol(this.pos).row;
        this.col = this.helpers.setRowCol(this.pos).col;
    }

    _randomizeLoc() {
        let row = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3)),
            col = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));

        this.pos = 'row' + row + 'col' + col;
    }
}
