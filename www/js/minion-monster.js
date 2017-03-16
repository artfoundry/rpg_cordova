/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(monsterOptions, grid, helpers) {
        super(monsterOptions, grid, helpers);
        this.pos = monsterOptions.pos;
        this.grid = grid;
        this.helpers = helpers;
    }

    initialize() {
        this._setMonster(this.pos);
    }
}