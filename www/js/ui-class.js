/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor(audio, events) {
        this.audio = audio;
        this.events = events;
        this.dialogs = {
            "dialogHeader"  : "Here Be Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact called the Elder Sign, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill every last frightful being to survive and leave with your life and your sanity. Each time you get near a creature, you lose a bit of your sanity, and each time you're attacked, you lose some health.  If you are attacked three times, you will die.  If you lose your sanity, you will die (essentially, as you will become a gibbering mess and easy prey).\n\nTo move, either click any space directly around your character or use the numeric keypad.  Clicking on a monster or moving toward a monster next to you with the keyboard will attack the monster. Good luck!\n\n",
            "online"        : "Play online (selecting this will post your score to the leaderboards and disable difficulty level switching mid-game)",
            "tips"          : "There are two types of monsters: an Elder, and the Shoggoths. The Elder creates a Shoggoth every turn and must be attacked three times to kill it.  While the Elder cannot attack, the Shoggoths can.  Each Shoggoth will attack if you approach within one square of it, but can be killed with one hit.  Every turn you are next to any monster, you will lose some sanity for each monster you're next to.\n\nThere are three levels in the dungeon.  Be sure to explore all of them!\n\nYour final score is calculated from the amount of remaining health, remaining sanity, number of monsters you kill, whether you find the Elder Sign, whether you kill the Elder, and whether you win the game (killing all monsters in the dungeon).",
            "gameOverDead"  : "The hideous monstrosity sucks the life out of you.  You are dead.",
            "gameOverInsane": "Your sanity and grasp on reality have succumbed to the immense dread brought on by your terrifying encounters. You sink to the ground, unable to move, lost in endless horror.",
            "gameOverWin"   : "You've slaughtered every last horrific creature. You make it out alive!",
            "score"         : "How are your monster slaying skills?",
            "wait"          : "Wait... something is moving in the darkness...",
            "fear"          : "Just the sight of the Elder horrifies you, preventing you from even thinking of attacking it!",
            "noExit"        : "You are here to find the Elder Sign.  There's no backing out now!",
            "noConnection"  : "Internet connection not detected. You must have a connection to submit and download scores."
        };
        this.defaultDynamicPanelOptions = [
            {
                'container' : '.panel-header',
                'content' : '<span class="dynamic creepy-text">Options</span>'
            },
            {
                'container' : '.panel-body-container',
                'id' : '#panel-options-diff',
                'buttonContainer' : '.panel-options',
                'disabled' : false,
                'callback' : this.setGameDifficulty.bind(this),
                'runCallbackOnOpen' : true
            },
            {
                'container' : '.panel-body-container',
                'id' : '#panel-options-snd',
                'buttonContainer' : '.panel-options',
                'disabled' : false,
                'callback' : this.updateSoundSetting.bind(this),
                'runCallbackOnOpen' : true
            },
            {
                'container' : '.panel-body-container',
                'id' : '#panel-options-music',
                'buttonContainer' : '.panel-options',
                'disabled' : false,
                'callback' : this.updateMusicSetting.bind(this),
                'runCallbackOnOpen' : true
            },
            {
                'container' : '.panel-body-container',
                'content' : '<div class="dynamic"><span class="creepy-text">Monsters!</span> is produced by<div class="logo"></div></div><div class="dynamic">Visit the <a href="https://www.facebook.com/lovecraft.monsters.game/" target="_blank"><span class="creepy-text">Monsters!</span> Facebook page!</a></div></div>'
            },
            {
                'container' : '.panel-footer',
                'content' : '<span class="button-container dynamic"><button id="restart-button" class="panel-button">Restart Game</button></span>',
                'buttonContainer' : '#restart-button',
                'disabled' : false,
                'callback' : this.restartGame.bind(this),
                'runCallbackOnOpen' : false
            }
        ];
        this.$panelPartials = $('<div></div>');
        this.$leaderboardPartial = $('<div></div>');
        this.gameIsOnline = false;
        this.statusMessages = [];
    }

    initialize() {
        this.preLoadPartials();
        this.manageTitleScreen();
    }

    manageTitleScreen() {
        if (Game.platform === 'desktop') {
            $('#title-screen').show();
            this.events.setUpGeneralInteractionListeners('#title-screen', function() { $('#title-screen').hide(); });
        }
    }

    preLoadPartials() {
        this.$panelPartials.load('html/partials/panel-options.html');
        this.$leaderboardPartial.load('html/partials/modal-leaderboards.html');
    }

    updateUIAtStart(params) {
        let dynamicPanelCallbacks = {
                'open' : this.dynamicPanelOpen.bind(this),
                'close' : this.dynamicPanelClose.bind(this)
            },
            dynamicPanelParams = {
                'open' : this.defaultDynamicPanelOptions
            },
            staticPanelCallbacks = {
                'open' : this.toggleStaticPanel.bind(this),
                'close' : this.toggleStaticPanel.bind(this)
            },
            questsPanelParams = {
                'open' : {
                    'button' : '#pc-button-quests',
                    'target' : '#quests',
                    'content' : params.player.quests,
                    'callback' : this.updateQuestPanelInfo.bind(this)
                },
                'close' : {
                    'button' : '#pc-button-quests',
                    'target' : '#quests'
                }
            };

        this.setUpPanelTrigger('#button-options', dynamicPanelCallbacks, dynamicPanelParams);
        this.setUpPanelTrigger('#pc-button-quests', staticPanelCallbacks, questsPanelParams);
        this.events.setUpGeneralInteractionListeners('#status-panel', this.toggleStatusPanel.bind(this));

        this.audio.setSoundState(Game.gameSettings.soundOn);
        this.audio.setMusicState(Game.gameSettings.musicOn);
        this.audio.playSoundEffect(['dungeon-ambience']);
        this.audio.setVolume('music', 0.15);
        this.audio.setVolume('sfx-dungeon-ambience', 0.2);

        this.modalClose(params);
    }

    setUpPanelTrigger(target, callbacks, params) {
        let targetActions = {
                'open-panel' : callbacks.open,
                'close-panel' : callbacks.close
            },
            actionParams = {
                'open-panel' : params.open,
                'close-panel' : params.close
            };

        this.events.setUpClickListener(target, targetActions, actionParams);
    }

    restartGame() {
        this.events.removeAllListeners();
        Game.initialize();
    }

    /*********************
     *  Modal functions
     *********************/

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
            panelCallbacks = {
                'open' : this.changeOnlineStatus.bind(this),
                'close' : this.changeOnlineStatus.bind(this)
            },
            // when opening the options panel from the modal, it should only contain the header, diff level, and button
            panelOptions = {
                'open': this.defaultDynamicPanelOptions.slice(0, 2).concat(this.defaultDynamicPanelOptions.slice(5))
            },
            $lastSection;

        if (scrollX > 0 || scrollY > 0)
            this.scrollWindow(-scrollX, -scrollY);

        $('.modal').show();

        // set up modal text content
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].class === "modal-header")
                $('.modal-header').text(this.dialogs[messages[i].text]);
            else {
                $('.modal .body-container').append(section);
                $lastSection = $('.modal-section:last-child');
                $lastSection.addClass(messages[i].class).append('<span>' + this.dialogs[messages[i].text] + '</span>');

                if (messages[i].text === 'online') {
                    $lastSection.prepend('<span id="modal-online-option" class="panel-option open-panel" data-options-difficulty="online">Online</span>');
                    this.setUpPanelTrigger('#modal-online-option', panelCallbacks, panelOptions);
                }

                if (messages[i].text === 'score') {
                    this.displayScore($lastSection, messages[i].scoreValues);
                }
            }
        }

        // set up modal buttons
        for (let i = 0; i < buttons.length; i++) {
            let action = {
                    "modal-button" : buttons[i].action.bind(this)
                },
                params = {
                    "modal-button" : buttons[i].params
                },
                $button;

            $('.modal-footer').append('<span class="button-container dynamic"><button id="' + buttons[i].id + '" class="modal-button"></button></span>');
            $button = $('#' + buttons[i].id);
            $button.text(buttons[i].label);
            this.events.setUpClickListener('#' + buttons[i].id, action, params);
            if (buttons[i].hidden)
                $button.hide();
        }
    }

    modalClose(params) {
        this.events.removeClickListener('.modal-button');
        if (this.gameIsOnline)
            this.defaultDynamicPanelOptions[1].disabled = true;
        // remove dynamically added content
        $('.modal .dynamic').remove();
        $('.modal').hide();
        if (params.callback)
            params.callback();
    }

    changeOnlineStatus(params) {
        let $onlineButton = $('#modal-online-option');

        if (params) {
            if (this.gameIsOnline) {
                $onlineButton.removeClass('option-highlight');
                this.gameIsOnline = false;
            } else {
        // add conditional for checking online status - if none, display error message
                this.gameIsOnline = true;
                $onlineButton.addClass('option-highlight');
                this.dynamicPanelOpen(params);
            }
        } else {
            this.dynamicPanelClose();
        }
    }

    displayScore(el, scoreValues) {
        let scores = this.calcScore(scoreValues);
    // add conditional for checking online status - if none, display error message

        el.children('span').addClass('subheader creepy-text');
        el.append('<div><span class="score-headers">Monsters slain: </span><span class="score score-text">' + scores.kills + '</span></div>');
        el.append('<div><span class="score-headers">Remaining health: </span><span class="score score-text">' + scores.health + '</span></div>');
        el.append('<div><span class="score-headers">Remaining sanity: </span><span class="score score-text">' + scores.sanity + '</span></div>');
        el.append('<div><span class="score-headers">Acquiring the Elder Sign: </span><span class="score score-text">' + scores.elderSign + '</span></div>');
        el.append('<div><span class="score-headers">Slaying the Elder: </span><span class="score score-text">' + scores.elder + '</span></div>');
        el.append('<div><span class="score-headers">Winning the game: </span><span class="score score-text">' + scores.win + '</span></div>');
        el.append('<div><span class="score-headers">Final score: </span><span class="score score-text">' + scores.total + '</span></div>');

        el.append('<div id="leaderboard"><span class="score-text">Monster Leaders</span></div>');

        if (this.gameIsOnline)
            Game.fbServices.saveScore(scores.total, this.displayLeaderboards.bind(this));
        else
            this.displayLeaderboards();
    }

    displayLeaderboards() {
        let scores = Game.fbServices.scores;

        $('#leaderboard').append(this.$leaderboardPartial);
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

    highlightButton(button) {
        $(button)
            .addClass('button-highlight', 500)
            .removeClass('button-highlight', 500)
            .addClass('button-highlight', 500)
            .removeClass('button-highlight', 500);
    }

    /********************
     *  Panel functions
     ********************/

    displayStatus(message) {
        let $status = $('#status-messages'),
            entry = '<div>' + this.dialogs[message] + '</div>';

        this.statusMessages.push(entry);
        if (this.statusMessages.length >= 10)
            this.statusMessages.pop();
        if ($status.hasClass('status-messages-open'))
            $status.append(entry);
        else {
            $status.html(entry);
            setTimeout(function() {
                $status.children().fadeOut(300);
            }, 1500);
        }
    }

    toggleStatusPanel() {
        let $status = $('#status-panel'),
            $messages = $('#status-messages'),
            lastMessage = this.statusMessages.length - 1;

        $status.children().show();
        if ($status.hasClass('status-panel-open')) {
            $messages.html(this.statusMessages[lastMessage]);
            setTimeout(function() {
                $messages.children().fadeOut(300);
            }, 1000);
            this._animatePanelToggle($status, 'status-panel-open');
        } else {
            $messages.html(this.statusMessages);
            this._animatePanelToggle($status, 'status-panel-open');
        }
    }

    toggleStaticPanel(params) {
        let $button = $(params.button),
            $target = $(params.target);

        if (params.content) {
            $button.addClass('close-panel').removeClass('open-panel');
            params.callback(params.content);
        } else {
            $button.addClass('open-panel').removeClass('close-panel');
        }
        this._animatePanelToggle($target, 'show-panel');
    }

    _animatePanelToggle($panel, className, callback) {
        $panel.hasClass(className) ? $panel.removeClass(className, 500, callback) : $panel.addClass(className, 500, callback);
    }

    updateQuestPanelInfo(questInfo) {
        let $targetBodyContainer = $('#quests .body-container'),
            questName = questInfo.currentQuest ? Game.quests[questInfo.currentQuest].questName : null,
            questText = questInfo.currentQuest ? Game.quests[questInfo.currentQuest].questText : null,
            questList = questInfo.completedQuests,
            questID = '';

        $targetBodyContainer.html('');
        if (questName) {
            $targetBodyContainer
                .append('<div class="quest-name">' + questName + '</div>')
                .append('<div class="quest-description">' + questText + '</div>');
        }
        if (questList.length > 0) {
            $targetBodyContainer.append('<h4 class="quest-completed-header">Completed quests</h4>');
            for (let name=0; name < questList.length; name++) {
                questID = questList[name];
                $targetBodyContainer.append('<div class="quest-name">&#8730; ' + Game.quests[questID].questName + '</div>');
            }
        }
    }

    /**
     * function dynamicPanelOpen
     * Sets up and displays a dynamic panel (one in which ALL content is loaded dynamically
     *
     * @param params: object containing at least an options array (of objects)
     */
    dynamicPanelOpen(params) {
        Game.helpers.setKeysDisabled();
        $('.panel').show();
        $('#grid-cover').show();
        $('#button-options').removeClass('open-panel');
        this.events.setUpGeneralInteractionListeners('#panel-close-button .button-close', this.dynamicPanelClose.bind(this));

        for (let option = 0; option < params.length; option++) {
            let currentOption = params[option],
                wrapperID = currentOption.id ? currentOption.id : null,
                buttonContainer = currentOption.buttonContainer ? currentOption.buttonContainer : null,
                listenerTarget = wrapperID ? wrapperID : buttonContainer,
                cbParams = currentOption.cbParams || null;

            if (currentOption.content) {
                $(currentOption.container).append(currentOption.content);
            }
            else if (wrapperID) {
                this.$panelPartials.find(wrapperID).clone().appendTo($(currentOption.container));
            }

            if (buttonContainer && currentOption.disabled === false)
                this.events.setUpGeneralInteractionListeners(listenerTarget, currentOption.callback, cbParams);

            if (currentOption.container === '.panel-footer')
                this.events.setUpGeneralInteractionListeners(listenerTarget, this.dynamicPanelClose.bind(this));

            if (currentOption.callback && currentOption.runCallbackOnOpen) {
                cbParams ? currentOption.callback(cbParams) : currentOption.callback();
            }

            if (currentOption.disabled === true)
                $(buttonContainer).find('.panel-option').addClass('option-disabled');
        }
    }

    dynamicPanelClose() {
        $('#grid-cover').hide();
        $('.panel').hide();
        $('#button-options').addClass('open-panel');
        Game.helpers.setKeysEnabled();
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

    /***********************
     *  Misc functions
     ***********************/

    showFearEffect(intensity, removeEffect = true) {
        let $fearEffect = $('#fear-effect');

        $fearEffect.show().animate({ opacity: intensity }, 250);
        if (removeEffect) {
            $fearEffect.animate({ opacity: 0 }, 250, function() {
                $('#fear-effect').hide();
            });
        }
    }

    /**
     * function calcScore
     * Calculates final scores
     * @param scoreValues: {{kills: number, health: number, elderSign: boolean, elderKilled: boolean, gameWon: boolean}}
     * @returns {{kills: number, health: number, elderSign: number, elder: number, win: number, total: number}}
     */
    calcScore(scoreValues) {
        let kills = scoreValues.kills * 5,
            health = scoreValues.health <= 0 ? 0 : scoreValues.health * 10,
            sanity = (scoreValues.sanity <= 0 || scoreValues.health <= 0) ? 0 : scoreValues.sanity * 2,
            elderSign = scoreValues.elderSign ? 20 : 0,
            elderPoints = scoreValues.elderKilled ? 25 : 0,
            winPoints = scoreValues.gameWon ? 50 : 0;

        return {
            'kills' : kills,
            'health' : health,
            'sanity' : sanity,
            'elderSign' : elderSign,
            'elder' : elderPoints,
            'win' : winPoints,
            'total' : kills + health + sanity + elderSign + elderPoints + winPoints
        };
    }

    /**
     * function updateStatusValue
     * Updates a stats panel value
     * @param params: object containing values for id (id of element to update) and value (value to update to)
     */
    updateStatusValue(params) {
        let $element = $(params.id + ' .stats-value'),
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
        } else if (params.id.includes('.pc-sanity')) {
            $('.pc-sanity .stats-bar-level').width(params.value + '%');
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
