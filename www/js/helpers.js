/**
 * Created by dsmarkowitz on 12/19/16.
 *
 * Helper functions used by most classes.
 */


class Helpers {
    /**
     * function findSurroundingTiles
     * Finds all tiles in a given radius from the passed in center tile, no farther, no closer, but ignores tiles that are out of the grid
     *
     * @param gridWidth: number of tiles of grid width, not including outer walls
     * @param gridHeight: number of tiles of grid height, not including outer walls
     * @param centerTile: string of the tile ID of the search origin
     * @param searchRadius: distance in tiles from the character to search
     * @returns $(): jquery object array of matching tiles
     */
    findSurroundingTiles(gridWidth, gridHeight, centerTile, searchRadius) {
        let center = this.getRowCol(centerTile),
            firstRow = center.row - searchRadius,
            firstCol = center.col - searchRadius,
            lastRow = center.row + searchRadius,
            lastCol = center.col + searchRadius,
            tiles = $(),
            tileToAdd = '';

        for (let r = firstRow; r <= lastRow; r++) {
            // if on the first or last row, and that row is inside the grid...
            if ((r === firstRow && firstRow >= 0) || (r === lastRow && lastRow <= (gridHeight + 1))){
                // ...then add all tiles for that row (as long as the tile is inside the grid as well
                for (let c = firstCol; c <= lastCol; c++) {
                    if (c >= 0 && c <= (gridWidth + 1)) {
                        tileToAdd = 'row' + r + 'col' + c;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            } else {
                // add the left and right tiles for the middle rows as long as they're inside the grid
                if (r >= 0 && r <= (gridHeight + 1)) {
                    if (firstCol >= 0) {
                        tileToAdd = 'row' + r + 'col' + firstCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                    if (lastCol <= (gridWidth + 1)) {
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

    randomizeLoc(option, gridWidth, gridHeight) {
        let row = 0,
            col = 0,
            values = {
                'rowFactor' : 0,
                'rowAdd' : 0,
                'colFactor' : 0,
                'colAdd' : 0
            };

        switch (option) {
            case 'right':
                values.rowFactor = 1;
                values.rowAdd = 0;
                values.colFactor = .5;
                values.colAdd = .5;
                break;
            case 'left':
                values.rowFactor = 1;
                values.rowAdd = 0;
                values.colFactor = 0;
                values.colAdd = .5;
                break;
            case 'top':
                values.rowFactor = 0;
                values.rowAdd = .5;
                values.colFactor = 1;
                values.colAdd = 0;
                break;
            case 'bottom':
                values.rowFactor = .5;
                values.rowAdd = .5;
                values.colFactor = 1;
                values.colAdd = 0;
                break;
            case 'center':
                values.rowFactor = .5;
                values.rowAdd = .3;
                values.colFactor = .5;
                values.colAdd = .3;
                break;
            default:
                values.rowFactor = 1;
                values.rowAdd = 0;
                values.colFactor = 1;
                values.colAdd = 0;
                break;
        }
        while (!$('#row' + row + 'col' + col).hasClass('walkable') || ($('#row' + row + 'col' + col).hasClass('object') || $('#row' + row + 'col' + col).hasClass('item'))) {
            row = Math.ceil((Math.random() * (gridHeight * values.rowFactor)) + (gridHeight * values.rowAdd));
            col = Math.ceil((Math.random() * (gridWidth * values.colFactor)) + (gridWidth * values.colAdd));
        }
        return 'row' + row + 'col' + col;
    }

    killObject(objectList, objectKey) {
        delete objectList[objectKey];
    }

    /**
     * function checkForNearbyCharacters
     * Looks for a specific type of character within a requested range of tiles and returns all found matches
     *
     * @param character: object of the character around which the search is done
     * @param charSearchType: string of the class name (no '.') of the character type to search for
     * @param distance: distance in tiles from the character to search
     * @param gridWidth: number of tiles of grid width, not including outer walls
     * @param gridHeight: number of tiles of grid height, not including outer walls
     * @returns {*}: array of matching tiles, or null if no matches
     */
    checkForNearbyCharacters(character, charSearchType, distance, gridWidth, gridHeight) {
        let characterLoc = character.pos,
            nearbyCharLoc = null,
            $surroundingTiles = this.findSurroundingTiles(gridWidth, gridHeight, characterLoc, distance);

        if ($surroundingTiles.hasClass(charSearchType)) {
            nearbyCharLoc = $.grep($surroundingTiles, function(tile){
                return $(tile).hasClass(charSearchType);
            });
        }
        return nearbyCharLoc;
    }

    checkPlayerDestination(keyCode, playerPos) {
        let colIndex = playerPos.indexOf('col'),
            rowIndex = playerPos.indexOf('row'),
            rowNum = +playerPos.slice(rowIndex+3, colIndex),
            colNum = +playerPos.slice(colIndex+3);

        switch (keyCode) {
            case 102: // numpad 6
                return playerPos.replace(/col[\d]+/, 'col' + (colNum+1));
            case 100: // numpad 4
                return playerPos.replace(/col[\d]+/, 'col' + (colNum-1));
            case 104: // numpad 8
                return playerPos.replace(/row[\d]+/, 'row' + (rowNum-1));
            case 98: // numpad 2
                return playerPos.replace(/row[\d]+/, 'row' + (rowNum+1));
            case 103: // numpad 7
                return 'row'+ (rowNum-1) + 'col' + (colNum-1);
            case 105: // numpad 9
                return 'row'+ (rowNum-1) + 'col' + (colNum+1);
            case 99: // numpad 3
                return 'row'+ (rowNum+1) + 'col' + (colNum+1);
            case 97: // numpad 1
                return 'row'+ (rowNum+1) + 'col' + (colNum-1);
        }
    }
    
    setKeysEnabled() {
        $('body').addClass('keys-enabled');
    }

    setKeysDisabled() {
        $('body').removeClass('keys-enabled');
    }
    
    getKeysEnabled() {
        return $('body').hasClass('keys-enabled');
    }

    isOffScreen(element) {
        let height = element.outerHeight(),
            width = element.outerWidth(),
            $win = $(window),
            viewport = {
                top : $win.scrollTop(),
                left : $win.scrollLeft()
            },
            elementOffset = element.offset(),
            showing;

        viewport.right = viewport.left + $win.width();
        viewport.bottom = viewport.top + $win.height();

        elementOffset.right = elementOffset.left + width;
        elementOffset.bottom = elementOffset.top + height;

        showing = {
            top : viewport.bottom - elementOffset.top,
            left: viewport.right - elementOffset.left,
            bottom: elementOffset.bottom - viewport.top,
            right: elementOffset.right - viewport.left
        };

        return showing;
    }
}
