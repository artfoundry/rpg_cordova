/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor(helpers, audio, events) {
        this.helpers = helpers;
        this.audio = audio;
        this.events = events;
        this.runTurnCycle = function() {};
        this.dialogs = {
            "dialogHeader"  : "Welcome to Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill every last frightful being to survive and leave with your life. If you are attacked three times, you will die.\n\nTo move, either click any space directly around your character or use the numeric keypad.  Clicking on a monster or moving toward a monster next to you with the keyboard will attack the monster. Good luck!\n\nClicking on the Options button in the upper right will allow you to change the difficulty level and turn the sound and music on/off.",
            "tips"          : "There are two types of monsters: an Elder, and the Shoggoths.  The Elder creates a Shoggoth every turn and must be attacked three times to kill it.  While the Elder cannot attack, the Shoggoths can.  Each Shoggoth will attack if you approach within one square of it, but can be killed with one hit.\n\nYour final score is calculated from the amount of remaining health and number of monsters killed.",
            "gameOverDead"  : "The hideous monstrosity sucks the life out of you.  You are dead.",
            "gameOverWin"   : "You've slaughtered every last horrific creature. You make it out alive!",
            "score"         : "Your final score for the game is: ",
            "wait"          : "Wait...something is moving in the darkness..."
        };
        this.panelOptions = [
            {
                'element' : '.panel-header',
                'content' : ' <span class="dynamic">Options</span>'
            },
            {
                'element' : '.panel-body-container',
                'content' : `<section class="dynamic">
                                <span class="panel-option-label">Difficulty: </span>
                                <span id="panel-options-diff" class="panel-options">
                                    <span id="panel-option-diff-easy" class="panel-option" data-options-difficulty="easy">Easy</span>
                                    <span id="panel-option-diff-medium" class="panel-option" data-options-difficulty="medium">Medium</span>
                                    <span id="panel-option-diff-hard" class="panel-option" data-options-difficulty="hard">Hard</span>
                                </span>
                            </section>`,
                'target' : '#panel-options-diff',
                'callback' : this.setGameDifficulty.bind(this),
                'runCallbackNow' : true
            },
            {
                'element' : '.panel-body-container',
                'content' : `<section class="dynamic">
                                <span class="panel-option-label">Sound: </span>
                                <span id="panel-options-snd" class="panel-options">
                                    <span id="panel-option-snd-on" class="panel-option" data-options-snd="on">On</span>
                                    <span id="panel-option-snd-off" class="panel-option" data-options-snd="off">Off</span>
                                </span>
                            </section>`,
                'target' : '#panel-options-snd',
                'callback' : this.updateSoundSetting.bind(this),
                'runCallbackNow' : true
            },
            {
                'element' : '.panel-body-container',
                'content' : `<section class="dynamic">
                                <span class="panel-option-label">Music: </span>
                                <span id="panel-options-music" class="panel-options">
                                    <span id="panel-option-music-on" class="panel-option" data-options-music="on">On</span>
                                    <span id="panel-option-music-off" class="panel-option" data-options-music="off">Off</span>
                                </span>
                            </section>`,
                'target' : '#panel-options-music',
                'callback' : this.updateMusicSetting.bind(this),
                'runCallbackNow' : true
            },
            {
                'element' : '.panel-footer',
                'content' : '<button class="panel-button dynamic">Close</button>',
                'target' : '.panel-button',
                'callback' : this.panelClose.bind(this),
                'runCallbackNow' : false
            }
        ];
    }

    initialize(turnController) {
        this.runTurnCycle = turnController.runTurnCycle;
    }

    updateUIAtStart(params) {
        this.events.setUpGeneralInteractionListeners('#button-options', this.panelOpen.bind(this));

        this.audio.setSoundState(Game.gameSettings.soundOn);
        this.audio.setMusicState(Game.gameSettings.musicOn);
        this.audio.playSoundEffect('dungeon-ambience');
        this.audio.setVolume('sfx-dungeon-ambience', 0.2);

        this.modalClose(params);
    }

    /**
     * function modalOpen
     * Unhides the main modal, displays messages in it, and unhides listed buttons.
     * @param messages: Object with a list of element IDs (referring to the modal elements), text IDs (referring to this.dialogs), and visibility flags
     * @param buttons: Array of button IDs (modal element IDs), button action functions, function parameters to pass, and visibility flags
     */
    modalOpen(messages, buttons) {
        let section = '<section class="modal-section dynamic"></section>',
            $body = $('body'),
            scrollY = $body.scrollTop(),
            scrollX = $body.scrollLeft();

        if (scrollX > 0 || scrollY > 0)
            this.scrollWindow(-scrollX, -scrollY);

        $('.modal').show();
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].class === "modal-header")
                $('.modal-header').text(this.dialogs[messages[i].text]);
            else {
                $('.modal-body-container').append(section);
                $('.modal-section:last-child').addClass(messages[i].class).text(this.dialogs[messages[i].text]);
                if (messages[i].text === 'score')
                    $('.modal-section:last-child').append('<span class="score score-text">' + this.calcScore(messages[i].scoreValues) + '!</span>');
            }
        }
        for (let i = 0; i < buttons.length; i++) {
            let action = {
                    "modal-button" : buttons[i].action.bind(this)
                },
                params = {
                    "modal-button" : buttons[i].params
                },
                $button;

            $('.modal-footer').append('<button id="' + buttons[i].id + '" class="modal-button dynamic"></button>');
            $button = $('#' + buttons[i].id);
            $button.text(buttons[i].label);
            this.events.setUpClickListener('#' + buttons[i].id, action, params);
            if (buttons[i].hidden)
                $button.hide();
        }
    }

    modalClose(params) {
        this.events.removeClickListener('.modal-button');
        // remove dynamically added content
        $('.modal .dynamic').remove();
        $('.modal').hide();
        if (params.callback)
            params.callback();
    }

    slideWindow(params) {
        let $allSlides = $(params.container).children(),
            button = params.button;

        if ($allSlides.hasClass('content-slide-left'))
            $allSlides.removeClass('content-slide-left', 300);
        else
            $allSlides.addClass('content-slide-left', 300);

        this._swapButton(button);
    }

    _swapButton(button) {
        let $button = $(button),
            tempText;

        tempText = $button.text();
        $button.data('temp') ? $button.text($button.data('temp')) : $button.text('Back');
        $button.data('temp', tempText);
    }

    displayStatus(message) {
        $('.status-message').addClass('status-message-open', 200);
        $('.status-text').text(this.dialogs[message]);
    }

    hideStatus() {
        $('.status-message').removeClass('status-message-open', 200);
        $('.status-text').text('');
    }

    /**
     * function optionsOpen
     * Sets up and appends a panel, using this.panelOptions for the dynamic content
     */
    panelOpen() {
        this.helpers.setKeysDisabled();
        $('.panel').show();
        $('#grid-cover').show();

        for (let option = 0; option < this.panelOptions.length; option++) {
            let currentOption = this.panelOptions[option],
                target = currentOption.target ? currentOption.target : null;
            $(currentOption.element).append(currentOption.content);
            if (target)
                this.events.setUpGeneralInteractionListeners(target, currentOption.callback);
            if (currentOption.callback && currentOption.runCallbackNow) {
                currentOption.callback();
            }
        }
        // remove the click-to-open listener for the Options button...
        this.events.removeClickListener('#button-options');
        // ...and set the button to close the panel instead
        this.events.setUpGeneralInteractionListeners('#button-options', this.panelClose.bind(this));
    }

    panelClose() {
        $('#grid-cover').hide();
        $('.panel').hide();
        this.helpers.setKeysEnabled();
        this.events.removeClickListener('#button-options');
        this.events.setUpGeneralInteractionListeners('#button-options', this.panelOpen.bind(this));
        // remove dynamically added content
        $('.panel .dynamic').remove();
    }

    setGameDifficulty(setting = Game.gameSettings.difficulty) {
        $('#panel-options-diff').children().removeClass('option-highlight');
        $('#panel-option-diff-' + setting).addClass('option-highlight');
        Game.gameSettings.difficulty = setting;
    }

    updateSoundSetting(setting = this.audio.getSoundState()) {
        this.audio.setSoundState(setting);
        $('#panel-options-snd').children().removeClass('option-highlight');
        $('#panel-option-snd-' + setting).addClass('option-highlight');
        if ($('#panel-options-music').length === 1)
            this.updateMusicSetting();
    }

    updateMusicSetting(setting = this.audio.getMusicState()) {
        let $musicOptions = $('#panel-options-music'),
            soundSetting = this.audio.getSoundState();

        this.audio.setMusicState(setting);
        $musicOptions.find('.panel-option').removeClass('option-highlight');
        $('#panel-option-music-' + setting).addClass('option-highlight');

        if (soundSetting === 'off') {
            $musicOptions.children('.panel-option').addClass('option-disabled');
            this.events.removeClickListener('#panel-options-music');
        }
        else {
            $musicOptions.children().removeClass('option-disabled');
            this.events.setUpGeneralInteractionListeners('#panel-options-music', this.updateMusicSetting.bind(this));
        }
    }

    calcScore(scoreValues) {
        if (scoreValues.health < 0)
            scoreValues.health = 0;
        return (scoreValues.kills*5) + (scoreValues.health*10);
    }

    updateStatusValue(params) {
        let $element = $(params.id + ' .status-value'),
            bubbleElements,
            difference = 0,
            newBubble = '<span class="life-bubble"></span>';

        if (params.id.includes('.pc-health')) {
            bubbleElements = $element.children('.life-bubble');
            difference = params.value - bubbleElements.length;
            for (let i=0; i < Math.abs(difference); i++) {
                if (difference < 0)
                    bubbleElements.last().remove();
                else
                    $element.append(newBubble);
            }
        }
        else
            $element.text(params.value);
    }


    /**
     * function scrollWindow
     * Used to scroll the window in a certain direction by the amounts provided in xValue and yValue
     *
     * @param xValue
     * @param yValue
     */
    scrollWindow(xValue, yValue) {
        let greaterValue = Math.abs(xValue) > Math.abs(yValue) ? xValue : yValue,
            lesserValue = greaterValue === xValue ? yValue : xValue,
            remainder = Math.abs(greaterValue) - Math.abs(lesserValue),
            x = xValue < 0 ? -1 : (xValue > 0 ? 1 : 0),
            y = yValue < 0 ? -1 : (yValue > 0 ? 1 : 0);

        for (let i=0; i < Math.abs(lesserValue); i++) {
            setTimeout(function() {
                window.scrollBy(x, y);
            }, i);
        }
        for (let i=0; i < remainder; i++) {
            if (greaterValue === xValue) {
                setTimeout(function() {
                    window.scrollBy(x, 0);
                }, i);
            }
            else {
                setTimeout(function() {
                    window.scrollBy(0, y);
                }, i);
            }
        }
    }
}
