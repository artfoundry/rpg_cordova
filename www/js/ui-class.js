/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor(audio, events) {
        this.audio = audio;
        this.events = events;
        this.dialogs = {
            "dialogHeader"  : "Welcome to Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill every last frightful being to survive and leave with your life. If you are attacked three times, you will die.\n\nTo move, either click any space directly around your character or use the numeric keypad.  Clicking on a monster or moving toward a monster next to you with the keyboard will attack the monster. Good luck!",
            "tips"          : "There are two types of monsters: an Elder, and the Shoggoths.  The Elder creates a Shoggoth every turn and must be attacked three times to kill it.  While it cannot attack, the Shoggoths can.  Each Shoggoth will attack if you approach within one square of it, but can be killed with one hit.\n\nYour final score is calculated from the amount of remaining health and number of monsters killed.",
            "gameOverDead"  : "The hideous monstrosity sucks the life out of you.  You are dead.",
            "gameOverWin"   : "You've slaughtered every last horrific creature. You make it out alive!",
            "score"         : "Your final score for the game is: ",
            "wait"          : "Wait...something is moving in the darkness..."
        };
        this.runTurnCycle = function() {};
    }

    initialize(turnController) {
        this.runTurnCycle = turnController.runTurnCycle;
    }

    /**
     * function dialogOpen
     * Unhides the main dialog, displays messages in it, and unhides listed buttons.
     * @param messages: Object with a list of element IDs (referring to the modal elements), text IDs (referring to this.dialogs), and visibility flags
     * @param buttons: Array of button IDs (modal element IDs), button action functions, function parameters to pass, and visibility flags
     */
    modalOpen(messages, buttons) {
        let button = '<button class="modal-button dynamic"></button>',
            section = '<section class="modal-section dynamic"></section>',
            $body = $('body'),
            scrollY = $body.scrollTop(),
            scrollX = $body.scrollLeft();

        if (scrollX > 0 || scrollY > 0)
            this.scrollWindow(-scrollX, -scrollY);

        $(".modal").show();
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].class === "modal-header")
                $(".modal-header").text(this.dialogs[messages[i].text]);
            else {
                $(".modal-body-container").append(section);
                $(".modal-section:last-child").addClass(messages[i].class).text(this.dialogs[messages[i].text]);
                if (messages[i].hidden)
                    $("." + messages[i].class + ":last-child").hide();
                if (messages[i].text === "score")
                    $(".modal-section:last-child").append('<span class="score score-text">' + this.calcScore(messages[i].scoreValues) + '!</span>');
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

            $(".modal-footer").append(button);
            $button = $(".modal-button:last-child");
            $button.text(buttons[i].label);
            this.events.setUpClickListener(".modal-button:last-child", action, params);
            if (buttons[i].hidden)
                $button.hide();
        }
    }

    modalClose(params) {
        this.audio.musicCheck();

        this.events.removeClickListener(".modal-button");
        $(".dynamic").remove();
        $(".modal").hide();
        if (params.callback)
            params.callback();
    }

    displayStatus(message) {
        $('.status-message').addClass('status-message-open', 200);
        $('.status-text').text(this.dialogs[message]);
    }

    hideStatus() {
        $('.status-message').removeClass('status-message-open', 200);
        $('.status-text').text('');
    }

    visibilityToggle(element) {
        $(element).toggle();
    }

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

    calcScore(scoreValues) {
        return (scoreValues.kills*5) + (scoreValues.health*10);
    }

    updateValue(params) {
        let $element = $(params.id + " .status-value"),
            bubbleElements,
            difference = 0,
            newBubble = "<span class='life-bubble'></span>";

        if (params.id.includes(".pc-health")) {
            bubbleElements = $element.children(".life-bubble");
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
}
