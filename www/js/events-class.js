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

    setUpGeneralInteractionListeners(target, targetAction, params = null) {
        $(target).click((e) => {
            let $target = $(e.target),
                selectedOpt = Object.keys($target.data())[0];

            if (selectedOpt)
                params = $target.data()[selectedOpt];

            targetAction(params);
        });
        if (params && params.keys) {
            $('body').keyup((e) => {
                if (params.keys.includes(e.which))
                    targetAction();
            });
        }
    }

    /**
     * function setUpClickListener
     * Click handler for tiles
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

        this.helpers.setKeysEnabled();
        
        $('body').keyup((e) => {
            if (this.helpers.getKeysEnabled()) {
                destinationTile = document.getElementById(this.helpers.checkPlayerDestination(e.which, playerPos));
                this.processAction(targetActions, params, destinationTile);
            }
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

    removeAllListeners() {
        $('*').off();
    }
}
