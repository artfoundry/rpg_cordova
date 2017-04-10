/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(monsterOptions, grid, helpers, audio) {
        super(monsterOptions, grid, helpers, audio);
        this.pos = monsterOptions.pos;
        this.grid = grid;
        this.helpers = helpers;
        this.audio = audio;
    }

    initialize() {
        this._setMonster(this.pos);
    }
}