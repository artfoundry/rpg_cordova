/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 */

class Events {
    setUpClickListener(target, callback, playerObject, turnController) {
        $(target).click((e) => { callback(e.currentTarget, playerObject, turnController); });
    }

    setUpTileChangeListener(target, callback) {
        $(target).on('tileChange', (e, tileClass, image) => { callback(e, tileClass, image); });
    }

    setUpLightChangeListener(target, callback) {
        $(target).on('lightChange', (e, tileClass, image) => { callback(e, tileClass, image); });
    }
}
