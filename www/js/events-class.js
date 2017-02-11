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
            for (let actionType in targetActions) {
                if (Object.prototype.hasOwnProperty.call(targetActions, actionType) && $(e.currentTarget).hasClass(actionType)) {
                    targetActions[actionType](e.currentTarget, params[actionType]);
                    break;
                }
            }
        });
    }

    removeClickListener(target) {
        $(target).off('click');
    }
}
