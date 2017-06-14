/**
 * Created by David on 5/10/17.
 */

class Dungeon {
    constructor(audio, ui) {
        this.levels = [];
        this.audio = audio;
        this.ui = ui;
        this.gridOptions = StartingOptions.gridOptions;
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

        if (levelObject)
            this.grid.drawGrid(levelObject.level, levelObject.items, levelObject.objects);
        else
            this.createNewLevel();
    }
}