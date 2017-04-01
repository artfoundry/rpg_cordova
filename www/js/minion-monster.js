/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(monsterOptions, ui, grid, helpers) {
        super(monsterOptions, ui, grid, helpers);
        this.pos = monsterOptions.pos;
        this.ui = ui;
        this.grid = grid;
        this.helpers = helpers;
    }

    initialize() {
        this._setMonster(this.pos);
    }
}