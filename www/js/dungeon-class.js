/**
 * Created by David on 5/10/17.
 */

class Dungeon {
    constructor(startingMap, audio, ui) {
        this.mapOptions = startingMap;
        this.monsterOptions = startingMap.monsterOptions;
        this.levels = [];
        this.currentLevel = startingMap.playerOptions.player1.startingLevel;
        this.audio = audio;
        this.ui = ui;
        this.gridOptions = {};
        this.levelMarkup = '';
        this.levelItems = {};
        this.levelObjects = {};
        this.grid = {};
        this.monsters = {};
    }

    createLevel(levelOptions, levelMarkup = null) {
        this.gridOptions = levelOptions;
        this.levelItems = levelOptions.items || null;
        this.levelObjects = levelOptions.objects || null;
        this.grid = new Grid(this, this.gridOptions, this.audio);
        this.grid.drawGrid(levelMarkup, this.levelItems, this.levelObjects);
    }

    saveLevel(monsterList) {
        this.levelMarkup = $('.grid >');
        this.levels.push({'level' : this.levelMarkup, 'monsters' : monsterList});
    }

    nextLevel(nextLevel, callback) {
        let dungeon = this,
            levelMarkup,
            isNewLevel = false,
            levelOptions = this.mapOptions.levels[nextLevel] || null;

        this.grid.clearGrid();
        if (this.levels[nextLevel]) {
            levelMarkup = this.levels[nextLevel].level;
            this.createLevel(levelOptions, levelMarkup);
            this.currentLevel = nextLevel;
        } else {
            this.createLevel(levelOptions);
            isNewLevel = true;
        }
        $.when(this.createLevel(levelOptions, levelMarkup)).done(function() {
             $.when(dungeon.loadMonstersForLevel(isNewLevel)).done(function() {
                 callback(dungeon.monsters);
             });
        });
    }

    loadMonstersForLevel(isNewLevel) {
        if (isNewLevel) {
            this.monsters = this.createMonstersForLevel();
        } else {
            this.monsters = this.getMonstersForLevel();
            for (let monster in this.monsters) {
                if (this.monsters.hasOwnProperty(monster)) {
                    this.monsters[monster].initialize();
                }
            }
        }
    }

    createMonstersForLevel() {
        let newMonsters = {};

        for(let monster in this.monsterOptions) {
            if (this.monsterOptions.hasOwnProperty(monster)) {
                if (this.monsterOptions[monster].startingLevel === this.currentLevel) {
                    newMonsters[monster] = this.monsterOptions[monster].subtype === 'elder' ? new ElderMonster(this.monsterOptions[monster], this, this.audio) : new MinionMonster(this.monsterOptions[monster], this, this.audio);
                    newMonsters[monster].randomPos();
                    newMonsters[monster].initialize();
                }
            }
        }
        return newMonsters;
    }

    getMonstersForLevel() {
        return this.levels[this.currentLevel].monsters;
    }
}