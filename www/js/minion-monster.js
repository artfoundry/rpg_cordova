/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(gridOptions, monsterOptions, helpers) {
        super(gridOptions, monsterOptions, helpers);
        this.pos = monsterOptions.pos;
        this.helpers = helpers;
    }

    initialize() {
        this._setmonster();
    }
}