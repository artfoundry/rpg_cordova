/**
 * Created by dsmarkowitz on 11/27/16.
 */

class Monster {
    constructor(gridOptions, monsterOptions) {
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.monsterType = monsterOptions.monsterType;
        this.health = monsterOptions.health;
        this.monsterRow = 0;
        this.monsterCol = 0;
        this.monsterPos = '';
    }

    initialize() {
        this._randomizeLoc();
        this._setmonster();
        this.randomMove();
    }

    _setmonster() {
        this.monsterPos = 'row' + this.monsterRow + 'col' + this.monsterCol;
        $('#' + this.monsterPos)
            .addClass(this.monsterType + ' monster')
            .trigger('tileChange', [this.monsterType, '<img class="content" src="img/' + this.monsterType + '.png">'])
            .removeClass('walkable');
    }

    clearMonsterImg(monster) {
        $('#' + monster.monsterPos)
            .addClass('walkable')
            .trigger('tileChange', [monster.monsterType, '<img class="content" src="img/trans.png">'])
            .removeClass(monster.monsterType + ' monster');
    }

    _randomizeLoc() {
        this.monsterRow = Math.ceil(Math.random() * (this.gridHeight/2) + (this.gridHeight/3));
        if (this.monsterRow === 0)
            this.monsterRow = 1;
        this.monsterCol = Math.ceil(Math.random() * (this.gridWidth/2) + (this.gridWidth/3));
        if (this.monsterCol === 0)
            this.monsterCol = 1;
    }

    randomMove() {
        const direction = Math.round((Math.random() * 40) / 10);

        this.clearMonsterImg(this);

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
