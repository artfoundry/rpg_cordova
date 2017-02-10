/**
 * Created by David on 12/22/16.
 */

class QueenMonster extends Monster {
    constructor(grid, gridOptions, monsterOptions, helpers) {
        super(grid, gridOptions, monsterOptions, helpers);
        this.grid = grid;
        this.helpers = helpers;
        this.oldPos = '';
        this.gridOptions = gridOptions;
    }

    saveCurrentPos() {
        this.oldPos = this.pos;
    }

    spawn() {
        let minionOptions = {
            "name" : "Minion",
            "health" : 1,
            "pos" : this.oldPos,
            "image" : "minion.png"
        };
        return new MinionMonster(this.grid, this.gridOptions, minionOptions, this.helpers);
    }
}