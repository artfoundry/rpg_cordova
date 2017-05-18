/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * functions for:
 * - handlers for player clicks and key presses
 * - removing handlers
 */


class Events {
    /**
     * function setUpGeneralInteractionListeners
     * Used to handle less complex events with just one action and one or no sets of params,
     * like key presses/mouse clicks during monster's turn or clicking on options buttons
     *
     * @param target - string of element selector for click handler
     * @param targetAction - object of callbacks
     * @param params - parameters to pass to callback
     */
    setUpGeneralInteractionListeners(target, targetAction, params = null) {
        $(target).click((e) => {
            let $target = $(e.target),
                selectedOpt = Object.keys($target.data())[0],
                actionParam;

            if (selectedOpt)
                actionParam = $target.data()[selectedOpt];

            targetAction(actionParam);
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
     * Click handler for movement and buttons
     *
     * @param target - string of element selector for click handler
     * @param targetActions - object of callbacks
     * @param params - parameters to pass to callback
     */
    setUpClickListener(target, targetActions, params) {
        $(target).click((e) => {
            this.processAction(e.currentTarget, targetActions, params);
        });
    }

    /**
     * function setUpArrowKeysListener
     * Key handler for movement
     *
     * @param playerPos - string of element id selector for player's current position
     * @param targetActions - object of callbacks
     * @param params - parameters to pass to callback
     */
    setUpArrowKeysListener(playerPos, targetActions, params) {
        let destinationTile = '';

        Game.helpers.setKeysEnabled();

        $('body').keyup((e) => {
            if (Game.helpers.getKeysEnabled()) {
                destinationTile = document.getElementById(Game.helpers.checkPlayerDestination(e.which, playerPos));
                this.processAction(destinationTile, targetActions, params);
            }
        });
    }

    /**
     * function processAction
     * Carries out the callbacks for the click or key press
     *
     * @param actionTarget - string of target element id/class for action to be applied
     * @param targetActions - object containing callbacks of possible actions to take
     * @param params - object with options to pass to callbacks
     */
    processAction(actionTarget, targetActions, params) {
        for (let actionType in targetActions) {
            if (Object.prototype.hasOwnProperty.call(targetActions, actionType) && $(actionTarget).hasClass(actionType)) {
                targetActions[actionType](params[actionType], actionTarget);
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
