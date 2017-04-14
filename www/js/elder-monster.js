/**
 * Created by David on 12/22/16.
 */

class ElderMonster extends Monster {
    constructor(monsterOptions, grid, helpers, audio) {
        super(monsterOptions, grid, helpers, audio);
        this.oldPos = '';
        this.grid = grid;
        this.helpers = helpers;
        this.audio = audio;
    }

    saveCurrentPos() {
        this.oldPos = this.pos;
    }

    spawn() {
        let minionOptions = {
            "name" : "Shoggoth",
            "type" : "monster",
            "subtype" : "shoggoth",
            "health" : 1,
            "pos" : this.oldPos
        };
        return new MinionMonster(minionOptions, this.grid, this.helpers, this.audio);
    }
}