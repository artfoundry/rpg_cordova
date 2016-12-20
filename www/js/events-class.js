/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 */

class Events {
    setUpClickListener(target, actions, params) {
        $(target).click((e) => {
            for (let targetType in actions) {
                if (Object.prototype.hasOwnProperty.call(actions, targetType) && $(e.currentTarget).hasClass(targetType)) {
                    actions[targetType](e.currentTarget, params[targetType]);
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
