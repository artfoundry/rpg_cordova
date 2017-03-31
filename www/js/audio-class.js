/**
 * Created by David on 3/22/17.
 */

class Audio {
    constructor() {
        this.setVolume('music', 0.2);
        this._soundOn = 'off';
        this._musicOn = 'off';
    }

    /**
     * function setMusicState
     * Turns music off/on based on passed option
     * @param option: string
     */
    setMusicState(option) {
        let audioEl = document.getElementById('music');

        if (this._soundOn) {
            this._musicOn = option || this._musicOn;
            if (this._musicOn) {
                audioEl.play();
            } else {
                audioEl.pause();
            }
        }
    }

    getMusicState() {
        return this._musicOn;
    }

    /**
     * function setSoundState
     * Turns all sound off/on based on passed option
     * @param option: string
     */
    setSoundState(option) {
        let allAudio = document.getElementsByTagName('audio');

        this._soundOn = option || this._soundOn;
        for (let i=0; i < allAudio.length; i++) {
            allAudio[i].muted = !this._soundOn;
        }
    }

    getSoundState() {
        return this._soundOn;
    }

    /**
     * function setVolume
     *
     * @param sound - string of audio element ID to be changed
     * @param level - volume level between 0 and 1
     */
    setVolume(sound, level) {
        document.getElementById(sound).volume = level;
    }

    playSoundEffect(sound) {
        if (this._soundOn)
            document.getElementById('sfx-' + sound).play();
    }
}