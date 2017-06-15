/**
 * Created by David on 5/10/17.
 */

class Dungeon {
    constructor(startingMap, audio, ui) {
        this.levels = [];
        this.audio = audio;
        this.ui = ui;
        this.gridOptions = startingMap.gridOptions;
        this.levelItems = this.gridOptions.items;
        this.levelObjects = this.gridOptions.objects;
        this.grid = new Grid(this, this.gridOptions, this.audio, this.ui);
    }

    createNewLevel() {
        this.grid.drawGrid(null, this.levelItems, this.levelObjects);
        this.levels.push({'level' : this.grid.levelStorage, 'items' : this.levelItems, 'objects' : this.levelObjects});
    }

    nextLevel(nextLevel) {
        let levelObject = this.levels[nextLevel];

        this.grid.clearGrid();
        levelObject ? this.grid.drawGrid(levelObject.level, levelObject.items, levelObject.objects) ? this.createNewLevel();
    }
}