/**
 * Created by David on 3/22/17.
 */

class Audio {
    constructor() {
        this.setVolume('music', 0.2);
    }

    musicCheck() {
        let audioEl = document.getElementById('music');

        if (audioEl.paused)
            audioEl.play();
    }

    /**
     * functionsetVolume
     *
     * @param sound - string of audio element ID to be changed
     * @param level - volume level between 0 and 1
     */
    setVolume(sound, level) {
        let audioEl = document.getElementById(sound);

        audioEl.volume = level;
    }

    playSoundEffect(sound) {
        document.getElementById('sfx-' + sound).play();
    }
}