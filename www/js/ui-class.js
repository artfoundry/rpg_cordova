/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor(audio, events) {
        this.audio = audio;
        this.events = events;
        this.runTurnCycle = function(){};
        this.dialogs = {
            "dialogHeader"  : "Here Be Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill every last frightful being to survive and leave with your life. If you are attacked three times, you will die.\n\nTo move, either click any space directly around your character or use the numeric keypad.  Clicking on a monster or moving toward a monster next to you with the keyboard will attack the monster. Good luck!\n\nClicking on the Options button in the upper right will allow you to change the difficulty level and turn the sound and music on/off.",
            "online"        : "Play online (selecting this will post your score to the leaderboards and disable difficulty level switching mid-game)",
            "tips"          : "There are two types of monsters: an Elder, and the Shoggoths.  The Elder creates a Shoggoth every turn and must be attacked three times to kill it.  While the Elder cannot attack, the Shoggoths can.  Each Shoggoth will attack if you approach within one square of it, but can be killed with one hit.\n\nYour final score is calculated from the amount of remaining health, number of monsters killed, whether you kill the Elder, and whether you win the game.",
            "gameOverDead"  : "The hideous monstrosity sucks the life out of you.  You are dead.",
            "gameOverWin"   : "You've slaughtered every last horrific creature. You make it out alive!",
            "score"         : "How're your monster slaying skills?",
            "wait"          : "Wait...something is moving in the darkness..."
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
                'runCallbackNow' : true
            },
            {
                'container' : '.panel-body-container',
                'id' : '#panel-options-snd',
                'buttonContainer' : '.panel-options',
                'disabled' : false,
                'callback' : this.updateSoundSetting.bind(this),
                'runCallbackNow' : true
            },
            {
                'container' : '.panel-body-container',
                'id' : '#panel-options-music',
                'buttonContainer' : '.panel-options',
                'disabled' : false,
                'callback' : this.updateMusicSetting.bind(this),
                'runCallbackNow' : true
            },
            {
                'container' : '.panel-footer',
                'content' : '<span class="button-container dynamic"><button class="panel-button">Close</button></span>',
                'buttonContainer' : '.panel-button',
                'disabled' : false,
                'callback' : this.dynamicPanelClose.bind(this),
                'runCallbackNow' : false
            }
        ];
        this.$panelPartials = $('<div></div>');
        this.gameIsOnline = false;
    }

    initialize(turnController) {
        this.preLoadPartials();
        this.runTurnCycle = turnController.runTurnCycle;
    }

    preLoadPartials() {
        this.$panelPartials.load('html/panel-options.html');
    }

    updateUIAtStart(params) {
        let dynamicPanelCallbacks = {
                'open' : this.dynamicPanelOpen.bind(this),
                'close' : this.dynamicPanelClose.bind(this)
            },
            dynamicPanelParams = {
                'open' : this.defaultDynamicPanelOptions
            },
            inventoryPanelCallbacks = {
                'open' : this.inventoryPanelToggle.bind(this),
                'close' : this.inventoryPanelToggle.bind(this)
            },
            questsPanelCallbacks = {
                'open' : this.questsPanelToggle.bind(this),
                'close' : this.questsPanelToggle.bind(this)
            },
            invPanelParams = {
                'open' : {
                    'button' : '#pc-button-inv',
                    'target' : '#inventory',
                    'content' : params.player.inventory
                },
                'close' : {
                    'button' : '#pc-button-inv',
                    'target' : '#inventory'
                }
            },
            currentQuest = params.player.quests.currentQuest,
            questsPanelParams = {
                'open' : {
                    'button' : '#pc-button-quests',
                    'target' : '#quests',
                    'content' : {
                        'questName' : Quests[currentQuest].questName,
                        'questText' : Quests[currentQuest].questText,
                        'completed' : params.player.quests.completedQuests
                    }
                },
                'close' : {
                    'button' : '#pc-button-quests',
                    'target' : '#quests'
                }
            };

        this.setUpPanelTrigger('#button-options', dynamicPanelCallbacks, dynamicPanelParams);
        this.setUpPanelTrigger('#pc-button-inv', inventoryPanelCallbacks, invPanelParams);
        this.setUpPanelTrigger('#pc-button-quests', questsPanelCallbacks, questsPanelParams);

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
                'open': this.defaultDynamicPanelOptions.slice(0, 2).concat(this.defaultDynamicPanelOptions.slice(4))
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
                $('.modal-body-container').append(section);
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

            $('.modal-footer').append('<span class="button-container"><button id="' + buttons[i].id + '" class="modal-button dynamic"></button></span>');
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

        el.children('span').addClass('subheader creepy-text');
        el.append('<div><span class="score-headers">Monsters slain: </span><span class="score score-text">' + scores.kills + '</span></div>');
        el.append('<div><span class="score-headers">Remaining health: </span><span class="score score-text">' + scores.health + '</span></div>');
        el.append('<div><span class="score-headers">Slaying the Elder: </span><span class="score score-text">' + scores.elder + '</span></div>');
        el.append('<div><span class="score-headers">Winning the game: </span><span class="score score-text">' + scores.win + '</span></div>');
        el.append('<div><span class="score-headers">Final score: </span><span class="score score-text">' + scores.total + '</span></div>');

        el.append('<div id="leaderboard"><span class="score-text">Monster Leaders</span></div>');

        if (this.gameIsOnline)
            Game.fbServices.saveScore(scores.total, this.displayLeaderboards);
        else
            this.displayLeaderboards();
    }

    displayLeaderboards() {
        let scores = Game.fbServices.scores,
            scoresMarkup = `
                <table>
                    <tbody>
                        <tr>
                            <th class="creepy-text column-header">Easy</th>
                            <th class="creepy-text column-header">Medium</th>
                            <th class="creepy-text column-header">Hard</th>
                        </tr>
                        <tr>
                            <td><ol id="score-list-easy"></ol></td>
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

    questsPanelToggle(params) {
        let $button = $(params.button),
            $target = $(params.target),
            $targetBodyContainer = $(params.target + ' .body-container'),
            questList = [];

        if (params.content) {
            $button.addClass('close-panel').removeClass('open-panel');
            $target.show();
            for (let item in params.content) {
                if (params.content.hasOwnProperty(item)) {
                    if (item === 'questName') {
                        $targetBodyContainer.append('<div class="quest-name">' + params.content[item] + '</div>');
                    } else if (item === 'questText') {
                        $targetBodyContainer.append('<div class="quest-description">' + params.content[item] + '</div>');
                    } else {
                        $targetBodyContainer.append('<div class="quest-completed-header">Completed quests</div>');
                        questList = params.content[item];
                        for (let name=0; name < questList.length; name++) {
                            $targetBodyContainer.append('<div class="quest-name">' + questList[name] + '</div>');
                        }
                    }
                }
            }
        } else {
            $button.addClass('open-panel').removeClass('close-panel');
            $targetBodyContainer.html('');
            $target.hide();
        }
    }

    inventoryPanelToggle(params) {
        let $button = $(params.button),
            $target = $(params.target),
            $targetBodyContainer = $(params.target + ' .body-container'),
            invItemName = '',
            invItemList = [];

        if (params.content) {
            $button.addClass('close-panel').removeClass('open-panel');
            $target.show();
            for (let item in params.content) {
                if (params.content.hasOwnProperty(item)) {
                    invItemList = params.content[item];
                    $targetBodyContainer.append('<div class="inventory-items-header">' + item + '</div>');
                    if (invItemList.length > 0) {
                        for (let i=0; i < invItemList.length; i++) {
                            invItemName = invItemList[i];
                            $targetBodyContainer.append('<div class="inventory-item-name inventory-item-' + invItemName + '">' + Items[invItemName].name + '</div>');
                            $targetBodyContainer.append('<div class="inventory-item-description">' + Items[invItemName].description + '</div>');
                        }
                    }
                }
            }
        } else {
            $button.addClass('open-panel').removeClass('close-panel');
            $targetBodyContainer.html('');
            $target.hide();
        }
    }

    processPanelItems(itemsObject) {


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
        $('#button-options').addClass('close-panel').removeClass('open-panel');

        for (let option = 0; option < params.length; option++) {
            let currentOption = params[option],
                wrapperID = currentOption.id ? currentOption.id : null,
                buttonContainer = currentOption.buttonContainer ? currentOption.buttonContainer : null,
                listenerTarget = wrapperID ? wrapperID : buttonContainer;

            if (currentOption.content) {
                $(currentOption.container).append(currentOption.content);
            }
            else if (wrapperID) {
                this.$panelPartials.find(wrapperID).clone().appendTo($(currentOption.container));
            }

            if (buttonContainer && currentOption.disabled === false)
                this.events.setUpGeneralInteractionListeners(listenerTarget, currentOption.callback);

            if (currentOption.callback && currentOption.runCallbackNow) {
                currentOption.callback();
            }

            if (currentOption.disabled === true)
                $(buttonContainer).find('.panel-option').addClass('option-disabled');
        }
    }

    dynamicPanelClose() {
        $('#grid-cover').hide();
        $('.panel').hide();
        $('#button-options').addClass('open-panel').removeClass('close-panel');
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

    calcScore(scoreValues) {
        let kills = scoreValues.kills * 5,
            health = scoreValues.health <= 0 ? 0 : scoreValues.health * 10,
            elderPoints = scoreValues.elderKilled ? 25 : 0,
            winPoints = scoreValues.gameWon ? 50 : 0;

        return {
            'kills' : kills,
            'health' : health,
            'elder' : elderPoints,
            'win' : winPoints,
            'total' : kills + health + elderPoints + winPoints
        };
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
