/**
 * Created by David on 12/22/16.
 */

class QueenMonster extends Monster {
    constructor(gridOptions, monsterOptions, helpers) {
        super(gridOptions, monsterOptions, helpers);
        this.oldPos = '';
        this.gridOptions = gridOptions;
        this.helpers = helpers;
    }

    saveCurrentPos() {
        this.oldPos = this.pos;
    }

    spawn() {
        let minionOptions = {
            "name" : "Minion",
            "type" : "minion",
            "health" : 1,
            "pos" : this.oldPos,
        };
        return new MinionMonster(this.gridOptions, minionOptions, this.helpers);
    }
}