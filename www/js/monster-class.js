/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(gridOptions, monsterOptions) {
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.monsterType = monsterOptions.monsterType;
        this.monsterRow = 0;
        this.monsterCol = 0;
        this.monsterPos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setmonster();
        this._randomMove();
    }

    _setmonster() {
        this.monsterPos = 'row' + this.monsterRow + 'col' + this.monsterCol;
        $('#' + this.monsterPos).addClass(this.monsterType + ' impassable').trigger('tileChange', [this.monsterType, '<img class="content" src="img/' + this.monsterType + '.png">']);
    }

    _clearMonsterImg() {
        $('#' + this.monsterPos).trigger('tileChange', [this.monsterType, '<img class="content" src="img/trans.png">']).removeClass(this.monsterType + ' impassable');
    }

    _randomizeLoc() {
        this.monsterRow = Math.round(Math.random() * this.gridHeight);
        this.monsterCol = Math.round(Math.random() * this.gridWidth);
    }

    _randomMove() {
        const direction = Math.round((Math.random() * 40) / 10);

        this._clearMonsterImg();

        switch (direction) {
            case 1:
                if (!($('#row' + (this.monsterRow - 1) + 'col' + this.monsterCol).hasClass('impassable')))
                    this.monsterRow -= 1;
                break;
            case 2:
                if (!($('#row' + this.monsterRow + 'col' + (this.monsterCol + 1)).hasClass('impassable')))
                    this.monsterCol += 1;
                break;
            case 3:
                if (!($('#row' + (this.monsterRow + 1) + 'col' + this.monsterCol).hasClass('impassable')))
                    this.monsterRow += 1;
                break;
            case 4:
                if (!($('#row' + this.monsterRow + 'col' + (this.monsterCol - 1)).hasClass('impassable')))
                    this.monsterCol -= 1;
                break;
        }
        this._setmonster();
    }
}
