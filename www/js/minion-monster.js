/**
 * Created by David on 12/22/16.
 */

class MinionMonster extends Monster {
    constructor(monsterOptions, dungeon, audio) {
        super(monsterOptions, dungeon, audio);
        this.pos = monsterOptions.pos || '';
        this.audio = audio;
    }
}