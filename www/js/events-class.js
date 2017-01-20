/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 * - removing click handler
 */

class Events {
    setUpClickListener(target, targetActions, params) {
        $(target).click((e) => {
            for (let tileType in targetActions) {
                if (Object.prototype.hasOwnProperty.call(targetActions, tileType) && $(e.currentTarget).hasClass(tileType)) {
                    targetActions[tileType](e.currentTarget, params[tileType]);
                    break;
                }
            }
        });
    }

    removeClickListener(target) {
        $(target).off('click');
    }

    setUpTileChangeListener(target, action) {
        $(target).on('tileChange', (e, tileClass, image) => { action(e, tileClass, image); });
    }

    setUpLightChangeListener(target, action) {
        $(target).on('lightChange', (e, tileClass, image) => { action(e, tileClass, image); });
    }
}
