/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 */

class Events {
    setUpClickListener(target, action, playerObject, callback) {
        $(target).click((e) => { action(e.currentTarget, playerObject, callback); });
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
