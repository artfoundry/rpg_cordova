/**
 * Created by David on 5/10/17.
 */

class Dungeon {
    constructor(startingMap, audio, ui) {
        this.mapOptions = startingMap;
        this.monsterOptions = startingMap.monsterOptions;
        this.levels = [];
        this.audio = audio;
        this.ui = ui;
        this.gridOptions = {};
        this.levelMarkup = '';
        this.levelItems = {};
        this.levelObjects = {};
        this.grid = {};
    }

    createNewLevel(levelOptions) {
        this.gridOptions = levelOptions;
        this.levelItems = levelOptions.items || null;
        this.levelObjects = levelOptions.objects || null;
        this.grid = new Grid(this, this.gridOptions, this.audio);
        this.grid.drawGrid(null, this.levelItems, this.levelObjects);
    }

    saveLevel(monsterList) {
        this.levelMarkup = JSON.stringify($('.grid').children());
        this.levels.push({'level' : this.levelMarkup, 'monsters' : monsterList});
    }

    nextLevel(nextLevel, callback) {
        let levelInfo,
            isNewLevel = false,
            levelOptions = this.mapOptions.levels[nextLevel];

        this.grid.clearGrid();
        if (this.levels[nextLevel]) {
            levelInfo = JSON.parse(this.levels[nextLevel].level);
            this.grid.drawGrid(levelInfo);
            this.grid.level = nextLevel;
        } else {
            this.createNewLevel(levelOptions);
            isNewLevel = true;
        }
        this.loadMonstersForLevel(isNewLevel, callback);
    }

    loadMonstersForLevel(isNewLevel, callback) {
        let newMonsters = {};

        if (isNewLevel) {
            newMonsters = this.createMonstersForLevel();
        } else {
            newMonsters = this.getMonstersForLevel();
            for (let monster in newMonsters) {
                if (newMonsters.hasOwnProperty(monster)) {
                    newMonsters[monster].initialize();
                }
            }
        }
        callback(newMonsters);
    }

    createMonstersForLevel() {
        let newMonsters = {};

        for(let monster in this.monsterOptions) {
            if (this.monsterOptions.hasOwnProperty(monster)) {
                if (this.monsterOptions[monster].startingLevel === this.grid.level) {
                    newMonsters[monster] = this.monsterOptions[monster].subtype === 'elder' ? new ElderMonster(this.monsterOptions[monster], this, this.audio) : new MinionMonster(this.monsterOptions[monster], this, this.audio);
                    newMonsters[monster].randomPos();
                    newMonsters[monster].initialize();
                }
            }
        }
        return newMonsters;
    }

    getMonstersForLevel() {
        return this.levels[this.grid.level].monsters;
    }
}