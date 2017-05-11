/**
 * Created by David on 5/10/17.
 */

class Dungeon {
    constructor(audio, ui) {
        this.levels = [];
        this.audio = audio;
        this.ui = ui;
        this.gridOptions = StartingOptions.gridOptions;
    }

    createNewLevel() {
        let grid = new Grid(this.gridOptions, this.audio, this.ui);
        this.levels.push(grid);
    }
}