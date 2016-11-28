/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(gridOptions) {
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.monsterRow = 0;
        this.monsterCol = 0;
        this.monsterPos = '';
        this.monsterType = '';
    }

    initialize(monsterType) {
        this.monsterType = monsterType;
        this._randomizeLoc();
        this._setmonster();
    }

    _setmonster() {
        this.monsterPos = 'row' + this.monsterRow + 'col' + this.monsterCol;
        $('#' + this.monsterPos).addClass(this.monsterType).trigger('tileChange', [this.monsterType, '<img class="content" src="img/' + this.monsterType + '.png">'])
    }

    _randomizeLoc() {
        this.monsterRow = Math.round(Math.random() * this.gridHeight);
        this.monsterCol = Math.round(Math.random() * this.gridWidth);
    }
}