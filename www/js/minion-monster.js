/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(gridOptions, monsterOptions) {
        super(gridOptions, monsterOptions);
        this.row = monsterOptions.row;
        this.col = monsterOptions.col;
    }

    initialize() {
        this._setmonster();
    }
}