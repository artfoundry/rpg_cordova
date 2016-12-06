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
        $('#' + this.monsterPos).addClass(this.monsterType).trigger('tileChange', [this.monsterType, '<img class="content" src="img/' + this.monsterType + '.png">'])
    }

    _randomizeLoc() {
        this.monsterRow = Math.round(Math.random() * this.gridHeight);
        this.monsterCol = Math.round(Math.random() * this.gridWidth);
    }

    _randomMove() {
        const direction = Math.round((Math.random() * 40) / 10);

        switch (direction) {
            case 1:
                if (this.monsterRow > 0)
                    this.monsterRow -= 1;
                break;
            case 2:
                if (this.monsterCol < this.gridWidth)
                    this.monsterCol += 1;
                break;
            case 3:
                if (this.monsterRow < this.gridHeight)
                    this.monsterRow += 1;
                break;
            case 4:
                if (this.monsterCol > 0)
                    this.monsterCol -= 1;
        }
        this._setmonster();
    }
}
