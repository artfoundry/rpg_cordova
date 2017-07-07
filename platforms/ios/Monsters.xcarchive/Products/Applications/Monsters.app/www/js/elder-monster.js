/**
 * Created by David on 12/22/16.
 */

class ElderMonster extends Monster {
    constructor(monsterOptions, dungeon, audio) {
        super(monsterOptions, dungeon, audio);
        this.oldPos = '';
        this.dungeon = dungeon;
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
            "pos" : this.oldPos,
            "startingLevel" : this.currentLevel
        };
        return new MinionMonster(minionOptions, this.dungeon, this.audio);
    }
}