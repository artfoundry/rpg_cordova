/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 * - removing click handler
 */


class Events {
    /**
     * function setUpClickListener
     *
     * @param target - element selector for click handler
     * @param targetActions - callback function
     * @param params - parameters to pass to callback
     */
    setUpClickListener(target, targetActions, params) {
        $(target).click((e) => {
            this.processAction(targetActions, params, e.currentTarget);
        });
    }

    setUpArrowKeysListener(targetActions, params, playerPos) {
        let destinationTile = '';

        $('body').keyup((e) => {
            destinationTile = document.getElementById(this.checkPlayerDestination(e.which, playerPos));
            this.processAction(targetActions, params, destinationTile);
        });
    }

    processAction(targetActions, params, destinationTile) {
        for (let actionType in targetActions) {
            if (Object.prototype.hasOwnProperty.call(targetActions, actionType) && $(destinationTile).hasClass(actionType)) {
                targetActions[actionType](destinationTile, params[actionType]);
                break;
            }
        }
    }

    checkPlayerDestination(keyCode, playerPos) {
        let colIndex = playerPos.indexOf('col'),
            rowIndex = playerPos.indexOf('row'),
            rowNum = +playerPos.slice(rowIndex+3, colIndex),
            colNum = +playerPos.slice(colIndex+3);

        switch (keyCode) {
            case 39: // right arrow
                return playerPos.replace(/col[\d]/, 'col' + (colNum+1));
            case 37: // left arrow
                return playerPos.replace(/col[\d]/, 'col' + (colNum-1));
            case 38: // up arrow
                return playerPos.replace(/row[\d]/, 'row' + (rowNum+1));
            case 40: // down arrow
                return playerPos.replace(/row[\d]/, 'row' + (rowNum+1));
        }
    }

    removeClickListener(target) {
        $(target).off('click');
    }

    removeArrowKeysListener() {
        $('body').off('keyup');
    }
}
