/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(grid, gridOptions, monsterOptions, helpers) {
        super(grid, gridOptions, monsterOptions);
        this.pos = monsterOptions.pos;
        this.helpers = helpers;
    }

    initialize() {
        this._setMonster(this.pos);
    }
}