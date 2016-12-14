/**
 * Created by David on 11/29/16.
 */

class TurnController {
    constructor(monsters) {
        this.monsters = monsters;
    }

    moveMonsters() {
        for (let monster in this.monsters) {
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster))
                this.monsters[monster]._randomMove();
        }
    }
}