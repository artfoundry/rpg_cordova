/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Events for responding to:
 * - tile changes
 * - player clicks
 */

class Events {
    setUpClickListener(target, callback, object) {
        $(target).click(function(e) { callback(e.currentTarget, object); });
    }

    setUpTileChangeListener(target, callback) {
        $(target).on('classChange', function(e, tileClass, image) { callback(e, tileClass, image); })
    }
}
