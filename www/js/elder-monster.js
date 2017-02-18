/**
 * Created by David on 12/22/16.
 */

class ElderMonster extends Monster {
    constructor(monsterOptions, grid, helpers) {
        super(monsterOptions, grid, helpers);
        this.oldPos = '';
        this.grid = grid;
        this.helpers = helpers;
    }

    saveCurrentPos() {
        this.oldPos = this.pos;
    }

    spawn() {
        let minionOptions = {
            "name" : "Shoggoth",
            "type" : "minion",
            "health" : 1,
            "pos" : this.oldPos
        };
        return new MinionMonster(minionOptions, this.grid, this.helpers);
    }
}