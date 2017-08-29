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
        this.monstersPerLevel = [];
    }

    clearGrid() {
        $('.row').remove();
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
        this.levels[this.currentLevel] = {'level' : this.levelMarkup, 'monsters' : monsterList};
    }

    nextLevel(nextLevel, callback) {
        let levelMarkup = null,
            isNewLevel = false,
            levelOptions = this.mapOptions.levels[nextLevel] || null;

        this.clearGrid();
        if (this.levels[nextLevel])
            levelMarkup = this.levels[nextLevel].level;
        else
            isNewLevel = true;
        this.currentLevel = nextLevel;
        this.createLevel(levelOptions, levelMarkup);
        this.loadMonstersForLevel(isNewLevel, callback);
    }

    updateMonsterNumForLevel(level) {
        this.monstersPerLevel[level] = Object.keys(this.monsters).length;
    }

    loadMonstersForLevel(isNewLevel, callback) {
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
        if (callback)
            callback(this.monsters);
    }

    createMonstersForLevel() {
        let newMonsters = {};

        for(let monster in this.monsterOptions) {
            if (this.monsterOptions.hasOwnProperty(monster)) {
                if (this.monsterOptions[monster].startingLevel === this.currentLevel) {
                    if (this.monsterOptions[monster].subtype === 'elder')
                        newMonsters[monster] = new ElderMonster(this.monsterOptions[monster], this, this.audio);
                    else
                        newMonsters[monster] = new MinionMonster(this.monsterOptions[monster], this, this.audio);
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