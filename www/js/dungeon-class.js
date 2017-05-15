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
    }

    createNewLevel() {
        let grid = new Grid(this.gridOptions, this.audio, this.ui);
        grid.drawGrid(this.levelItems);
        this.levels.push(grid);
    }
}