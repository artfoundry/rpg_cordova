/**
 * Created by David on 3/22/17.
 */

class Audio {
    constructor() {
        this.setVolume('music', 0.2);
        this.soundOn = false;
        this.musicOn = false;
    }

    setMusicState(option) {
        let audioEl = document.getElementById('music');

        if (this.soundOn) {
            this.musicOn = $.parseJSON(option);
            if (this.musicOn) {
                audioEl.play();
            } else {
                audioEl.pause();
            }
        }
    }

    setSoundState(option) {
        let allAudio = document.getElementsByTagName('audio');

        this.soundOn = $.parseJSON(option);
        for (let i=0; i < allAudio.length; i++) {
            allAudio[i].muted = !this.soundOn;
        }
    }

    /**
     * functionsetVolume
     *
     * @param sound - string of audio element ID to be changed
     * @param level - volume level between 0 and 1
     */
    setVolume(sound, level) {
        document.getElementById(sound).volume = level;
    }

    playSoundEffect(sound) {
        if (this.soundOn)
            document.getElementById('sfx-' + sound).play();
    }
}