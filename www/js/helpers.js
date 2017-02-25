/**
 * Created by dsmarkowitz on 12/19/16.
 *
 * Helper functions used by player and turn-control classes.
 */

/*
 * _findSurroundingTiles()
 * Finds all tiles in a given radius from the passed in center tile, no farther, no closer, but ignores tiles that are out of the grid
 */

class Helpers {
    constructor(gridOptions) {
        this.grid = gridOptions;
    }

    findSurroundingTiles(centerRow, centerCol, searchRadius) {
        let firstRow = +centerRow - searchRadius,
            firstCol = +centerCol - searchRadius,
            lastRow = +centerRow + searchRadius,
            lastCol = +centerCol + searchRadius,
            tiles = $(),
            tileToAdd = '';

        for (let r = firstRow; r <= lastRow; r++) {
            // if on the first or last row, and that row is inside the grid...
            if ((r === firstRow && firstRow >= 0) || (r === lastRow && lastRow <= (this.grid.gridHeight + 1))){
                // ...then add all tiles for that row (as long as the tile is inside the grid as well
                for (let c = firstCol; c <= lastCol; c++) {
                    if (c >= 0 && c <= (this.grid.gridWidth + 1)) {
                        tileToAdd = 'row' + r + 'col' + c;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            } else {
                // add the left and right tiles for the middle rows as long as they're inside the grid
                if (r >= 0 && r <= (this.grid.gridHeight + 1)) {
                    if (firstCol >= 0) {
                        tileToAdd = 'row' + r + 'col' + firstCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                    if (lastCol <= (this.grid.gridWidth + 1)) {
                        tileToAdd = 'row' + r + 'col' + lastCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            }
        }
        return tiles;
    }

    getRowCol(pos) {
        let colIndex = pos.indexOf('col');

        return {
            row : +pos.slice(3, colIndex),
            col : +pos.slice(colIndex + 3)
        }
    }

    killObject(objectList, objectKey) {
        delete objectList[objectKey];
    }

    checkForNearbyCharacters(character, charSearchType) {
        let characterLoc = character.pos,
            colIndex = characterLoc.indexOf('col'),
            characterRow = characterLoc.slice(3, colIndex),
            characterCol = characterLoc.slice(colIndex + 3),
            $nearbyCharLoc = null,
            $surroundingTiles = this.findSurroundingTiles(characterRow, characterCol, 1);

        if ($surroundingTiles.hasClass(charSearchType)) {
            $nearbyCharLoc = $.grep($surroundingTiles, function(tile){
                return $(tile).hasClass(charSearchType);
            });
        }
        return $nearbyCharLoc;
    }
}
