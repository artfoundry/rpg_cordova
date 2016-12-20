/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(gridOptions, monsterOptions) {
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.name = monsterOptions.monsterType;
        this.health = monsterOptions.health;
        this.row = 0;
        this.col = 0;
        this.pos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setmonster();
    }

    _setmonster() {
        this.pos = 'row' + this.row + 'col' + this.col;
        $('#' + this.pos)
            .addClass(this.name + ' monster')
            .trigger('tileChange', [this.name, '<img class="content" src="img/' + this.name + '.png">'])
            .removeClass('walkable');
    }

    _randomizeLoc() {
        this.row = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3));
        if (this.row === 0)
            this.row = 1;
        this.col = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));
        if (this.col === 0)
            this.col = 1;
    }

    randomMove() {
        const direction = Math.round((Math.random() * 40) / 10);

        switch (direction) {
            case 1:
                if (!($('#row' + (this.row - 1) + 'col' + this.col).hasClass('impassable')))
                    this.row -= 1;
                break;
            case 2:
                if (!($('#row' + this.row + 'col' + (this.col + 1)).hasClass('impassable')))
                    this.col += 1;
                break;
            case 3:
                if (!($('#row' + (this.row + 1) + 'col' + this.col).hasClass('impassable')))
                    this.row += 1;
                break;
            case 4:
                if (!($('#row' + this.row + 'col' + (this.col - 1)).hasClass('impassable')))
                    this.col -= 1;
                break;
        }
        this._setmonster();
    }
}
