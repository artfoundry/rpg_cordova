/**
 * Created by David on 12/22/16.
 */

class ElderMonster extends Monster {
    constructor(monsterOptions, ui, grid, helpers) {
        super(monsterOptions, ui, grid, helpers);
        this.oldPos = '';
        this.ui = ui;
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
            "subtype" : "monster",
            "health" : 1,
            "pos" : this.oldPos
        };
        return new MinionMonster(minionOptions, this.grid, this.helpers);
    }
}