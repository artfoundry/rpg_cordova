/**
 * Created by David on 2/3/17.
 */

class PlayerActions {
    constructor(players) {
        this.players = players;
    }

    /**
     * function movePlayer
     * Moves player character to newTile
     * Parameters:
     * - params: Object sent by TurnController containing player object and callback under "walkable" key
     * - newTile: String of tile's id in the format "row#col#"
     */
    movePlayer(newTile, params) {
        let player = this.players[params.player],
            currentPos = player.pos,
            currentRow = player.row,
            currentCol = player.col,
            newTilePos = newTile.id,
            callback = params.callback;

        if ((newTilePos === (PlayerActions._rightTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._leftTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._bottomTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._topTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._trTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._tlTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._brTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._blTile(currentRow, currentCol)))
        ) {
            player._setLighting(newTilePos);
            player.pos = newTilePos;
            player._setPlayer(newTilePos, currentPos);
            callback();
        }
    }

    static _topTile(row, col) { return 'row' + (row - 1) + 'col' + col; }
    static _bottomTile(row, col) { return 'row' + (row + 1) + 'col' + col; }
    static _leftTile(row, col) { return 'row' + row + 'col' + (col - 1); }
    static _rightTile(row, col) { return 'row' + row + 'col' + (col + 1); }
    static _tlTile(row, col) { return 'row' + (row - 1) + 'col' + (col - 1); }
    static _trTile(row, col) { return 'row' + (row - 1) + 'col' + (col + 1); }
    static _blTile(row, col) { return 'row' + (row + 1) + 'col' + (col - 1); }
    static _brTile(row, col) { return 'row' + (row + 1) + 'col' + (col + 1); }
}