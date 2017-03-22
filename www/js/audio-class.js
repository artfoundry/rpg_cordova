/**
 * Created by David on 3/22/17.
 */

class Audio {
    musicCheck() {
        let audioEl = document.getElementById('music');

        if (audioEl.paused)
            audioEl.play();
    }

    playSoundEffect(sound) {
        document.getElementById('sfx-' + sound).play();
    }
}