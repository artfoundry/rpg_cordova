/**
 * Created by David on 3/22/17.
 */

class Audio {
    constructor() {
        this._soundOn = Game.gameSettings.soundOn;
        this._musicOn = Game.gameSettings.musicOn;
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
            this._musicOn === "on" ? audioEl.play() : audioEl.pause();
            Game.gameSettings.musicOn = this._musicOn;
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
            allAudio[i].muted = this._soundOn !== "on";
        }
        Game.gameSettings.soundOn = this._soundOn;
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

    /**
     * function playSoundEffect
     * Plays sound provided. If probability provided, only plays sound if random number is lower than probability
     * @param sounds: string of name of mp3 file minus the leading 'sfx-' and the trailing '.mp3'
     * @param probability: decimal value between 0 and .99 (set to 1 if not provided)
     */
    playSoundEffect(sounds, probability = 1) {
        let magic8BallSaysYes = Math.random() < probability,
            option = Math.floor(Math.random() * sounds.length);

        if (this._soundOn) {
            if (magic8BallSaysYes) {
                document.getElementById('sfx-' + sounds[option]).play();
            }
        }
    }
}