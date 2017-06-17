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
        this.levelItems = {};
        this.levelObjects = {};
        this.grid = {};
    }

    createNewLevel(levelOptions) {
        this.gridOptions = levelOptions;
        this.levelItems = levelOptions.items || null;
        this.levelObjects = levelOptions.objects || null;
        this.grid = new Grid(this, this.gridOptions, this.audio, this.ui);
        this.grid.drawGrid(null, this.levelItems, this.levelObjects);
        this.levels.push({'level' : this.grid.levelStorage, 'items' : this.levelItems, 'objects' : this.levelObjects});
    }

    nextLevel(nextLevel) {
        let levelInfo = this.levels[nextLevel],
            levelOptions = this.mapOptions.levels[nextLevel];

        this.grid.clearGrid();
        levelInfo ? this.grid.drawGrid(levelInfo.level, levelInfo.items, levelInfo.objects) : this.createNewLevel(levelOptions);
    }
}