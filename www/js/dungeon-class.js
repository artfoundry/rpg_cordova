/**
 * Created by David on 5/10/17.
 */

class Dungeon {
    constructor(startingMap, audio, ui) {
        this.mapOptions = startingMap;
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

    nextLevel(nextLevel, restoreMonsters) {
        let levelInfo,
            isNewLevel = false,
            levelOptions = this.mapOptions.levels[nextLevel];

        this.grid.clearGrid();
        if (this.levels[nextLevel]) {
            levelInfo = JSON.parse(this.levels[nextLevel].level);
            this.grid.drawGrid(levelInfo);
        } else {
            this.createNewLevel(levelOptions);
            isNewLevel = true;
        }
        restoreMonsters(isNewLevel, nextLevel);
    }

    getMonstersForLevel(level) {
        return this.levels[level].monsters;
    }
}