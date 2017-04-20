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
            "dialogHeader"  : "Here Be Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill every last frightful being to survive and leave with your life. If you are attacked three times, you will die.\n\nTo move, either click any space directly around your character or use the numeric keypad.  Clicking on a monster or moving toward a monster next to you with the keyboard will attack the monster. Good luck!\n\nClicking on the Options button in the upper right will allow you to change the difficulty level and turn the sound and music on/off.",
            "online"        : "Play online (selecting this will post your score to the leaderboards and disable difficulty level switching mid-game)",
            "tips"          : "There are two types of monsters: an Elder, and the Shoggoths.  The Elder creates a Shoggoth every turn and must be attacked three times to kill it.  While the Elder cannot attack, the Shoggoths can.  Each Shoggoth will attack if you approach within one square of it, but can be killed with one hit.\n\nYour final score is calculated from the amount of remaining health and number of monsters killed.",
            "gameOverDead"  : "The hideous monstrosity sucks the life out of you.  You are dead.",
            "gameOverWin"   : "You've slaughtered every last horrific creature. You make it out alive!",
            "score"         : "Your final score for the game is: ",
            "wait"          : "Wait...something is moving in the darkness..."
        };
        this.defaultPanelOptions = [
            {
                'element' : '.panel-header',
                'content' : ' <span class="dynamic creepy-text">Options</span>'
            },
            {
                'element' : '.panel-body-container',
                'target' : '#panel-options-diff',
                'disabled' : false,
                'callback' : this.setGameDifficulty.bind(this),
                'runCallbackNow' : true
            },
            {
                'element' : '.panel-body-container',
                'target' : '#panel-options-snd',
                'disabled' : false,
                'callback' : this.updateSoundSetting.bind(this),
                'runCallbackNow' : true
            },
            {
                'element' : '.panel-body-container',
                'target' : '#panel-options-music',
                'disabled' : false,
                'callback' : this.updateMusicSetting.bind(this),
                'runCallbackNow' : true
            },
            {
                'element' : '.panel-footer',
                'content' : '<button class="panel-button dynamic">Close</button>',
                'target' : '.panel-button',
                'disabled' : false,
                'callback' : this.panelClose.bind(this),
                'runCallbackNow' : false
            }
        ];
    }

    initialize(turnController) {
        this.runTurnCycle = turnController.runTurnCycle;
    }

    updateUIAtStart(params) {
        let panelCallbacks = {
            'open' : this.panelOpen.bind(this),
            'close' : this.panelClose.bind(this)
        };

        this.setUpPanelTrigger('#button-options', panelCallbacks, this.defaultPanelOptions);

        this.audio.setSoundState(Game.gameSettings.soundOn);
        this.audio.setMusicState(Game.gameSettings.musicOn);
        this.audio.playSoundEffect(['dungeon-ambience']);
        this.audio.setVolume('music', 0.15);
        this.audio.setVolume('sfx-dungeon-ambience', 0.2);

        this.modalClose(params);
    }

    setUpPanelTrigger(target, callbacks, options) {
        let targetActions = {
                'openPanel' : callbacks.open,
                'closePanel' : callbacks.close
            },
            actionParam = {
                'openPanel' : {
                    'options' : options
                }
            };

        this.events.setUpClickListener(target, targetActions, actionParam);
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
            scrollX = $body.scrollLeft(),
            score = 0,
            panelCallbacks = {
                'open' : this.changeOnlineStatus.bind(this),
                'close' : this.changeOnlineStatus.bind(this)
            },
            panelOptions = this.defaultPanelOptions.slice(0, 2).concat(this.defaultPanelOptions.slice(4)),
            $lastSection;

        if (scrollX > 0 || scrollY > 0)
            this.scrollWindow(-scrollX, -scrollY);

        $('.modal').show();
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].class === "modal-header")
                $('.modal-header').text(this.dialogs[messages[i].text]);
            else {
                $('.modal-body-container').append(section);
                $lastSection = $('.modal-section:last-child');
                $lastSection.addClass(messages[i].class).append('<span>' + this.dialogs[messages[i].text] + '</span>');

                if (messages[i].text === 'online') {
                    $lastSection.prepend('<span id="modal-online-option" class="panel-option openPanel" data-options-difficulty="online">Online</span>');
                    this.setUpPanelTrigger('#modal-online-option', panelCallbacks, panelOptions);
                }

                if (messages[i].text === 'score') {
                    score = this.calcScore(messages[i].scoreValues);
                    $lastSection.children('span').addClass('subheader creepy-text push-right');
                    $lastSection.append('<span class="score score-text">' + score + '</span>');
                    $lastSection.append('<div id="leaderboard"><span class="score-text">Monster Leaders</span></div>');
                    Game.fbServices.saveScore(score, this.displayScores);
                }
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

    changeOnlineStatus(params) {
        let $onlineButton = $('#modal-online-option'),
            isOnline = $onlineButton.hasClass('option-highlight');

        if (params.options) {
            if (isOnline) {
                $onlineButton.removeClass('option-highlight');
            } else {
                this.panelOpen(params);
                this.defaultPanelOptions[1].disabled = true;
                $onlineButton.addClass('option-highlight');
            }
        } else {
            this.panelClose();
        }
    }

    displayScores() {
        let scores = Game.fbServices.scores,
            scoresMarkup = `
            <table>
                <tbody>
                    <tr class="creepy-text subheader">
                        <th>Easy</th>
                        <th>Medium</th>
                        <th>Hard</th>
                    </tr>
                    <tr><td><ol id="score-list-easy"></ol></td>
                        <td><ol id="score-list-medium"></ol></td>
                        <td><ol id="score-list-hard"></ol></td>
                    </tr>
                </tbody>
            </table>
        `;

        $('#leaderboard').append(scoresMarkup);
        for (let list in scores) {
            if (scores.hasOwnProperty(list) && scores[list].length > 0) {
                scores[list].reverse();
                for (let s=0; s < scores[list].length; s++) {
                    $('#score-list-' + list).append('<li class="score"><span class="score-text">' + scores[list][s] + '</span></li>');
                }
            }
        }
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
     * function panelOpen
     * Sets up and displays a panel
     *
     * @param params: object containing at least an options array (of objects)
     */
    panelOpen(params) {
        let ui = this;

        this.helpers.setKeysDisabled();
        $('.panel').show();
        $('#grid-cover').show();
        $('#button-options').addClass('closePanel').removeClass('openPanel');

        for (let option = 0; option < params.options.length; option++) {
            let currentOption = params.options[option],
                target = currentOption.target ? currentOption.target : null,
                activateButtons = () => {
                    if (target && currentOption.disabled === false)
                        ui.events.setUpGeneralInteractionListeners(target, currentOption.callback);
                    if (currentOption.callback && currentOption.runCallbackNow) {
                        currentOption.callback();
                    }
                    if (currentOption.disabled === true)
                        $(target).addClass('option-disabled');
                };

            if (currentOption.content) {
                $(currentOption.element).append(currentOption.content);
                activateButtons();
            }
            else {
                $(currentOption.element).append('<div class="dynamic"></div>');
                $(currentOption.element + ' div:last-child').load('html/panel-options.html ' + target, activateButtons);
            }
        }
    }

    panelClose() {
        $('#grid-cover').hide();
        $('.panel').hide();
        $('#button-options').addClass('openPanel').removeClass('closePanel');
        this.helpers.setKeysEnabled();
        // remove dynamically added content
        $('.panel .dynamic').remove();
    }

    setGameDifficulty(setting = Game.gameSettings.difficulty) {
        $('#panel-options-diff').find('.panel-option').removeClass('option-highlight');
        $('#panel-option-diff-' + setting).addClass('option-highlight');
        Game.gameSettings.difficulty = setting;
    }

    updateSoundSetting(setting = this.audio.getSoundState()) {
        this.audio.setSoundState(setting);
        $('#panel-options-snd').find('.panel-option').removeClass('option-highlight');
        $('#panel-option-snd-' + setting).addClass('option-highlight');
        if ($('#panel-options-music').length === 1)
            this.updateMusicSetting();
    }

    updateMusicSetting(setting = this.audio.getMusicState()) {
        let $musicOptions = $('#panel-options-music').find('.panel-option'),
            soundSetting = this.audio.getSoundState();

        this.audio.setMusicState(setting);
        $musicOptions.removeClass('option-highlight');
        $('#panel-option-music-' + setting).addClass('option-highlight');

        if (soundSetting === 'off') {
            $musicOptions.addClass('option-disabled');
            this.events.removeClickListener('#panel-options-music');
        }
        else {
            $musicOptions.removeClass('option-disabled');
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
