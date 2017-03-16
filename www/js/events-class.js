/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 * - removing click handler
 */


class Events {
    constructor(helpers) {
        this.helpers = helpers;
    }

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
            destinationTile = document.getElementById(this.helpers.checkPlayerDestination(e.which, playerPos));
            this.processAction(targetActions, params, destinationTile);
        });
    }

    processAction(targetActions, params, destinationTile) {
        for (let actionType in targetActions) {
            if (Object.prototype.hasOwnProperty.call(targetActions, actionType) && $(destinationTile).hasClass(actionType)) {
                targetActions[actionType](params[actionType], destinationTile);
                break;
            }
        }
    }

    removeClickListener(target) {
        $(target).off('click');
    }

    removeArrowKeysListener() {
        $('body').off('keyup');
    }
}
