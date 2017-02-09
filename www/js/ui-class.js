/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor(events) {
        this.events = events;
        this.dialogs = {
            "dialogHeader"  : "Welcome to Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill all the creatures to survive and leave with your life. If you are attacked three times, you will die.  Good luck!",
            "tips"          : "There are two types of monsters: a Queen, and her minions.  The Queen spawns a minion every turn and must be attacked three times to kill her.  While she cannot attack, her minions can.  Each minion will attack if you approach within one square of it, but can be killed with one hit.",
            "gameOverDead"  : "The hideous monstrosity sucks the life out of you.  You are dead.",
            "gameOverWin"   : "You've slaughtered every last creature. You make it out alive!"
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
            section = '<section class="modal-section dynamic"></section>';

        $(".modal").show();
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].class === "modal-header")
                $(".modal-header").text(this.dialogs[messages[i].text]);
            else {
                $(".modal-body-container").append(section);
                $(".modal-section:last-child").addClass(messages[i].class).text(this.dialogs[messages[i].text]);
                if (messages[i].hidden)
                    $("." + messages[i].class + ":last-child").hide();
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

    visibilityToggle(e, element) {
        $(element).toggle();
    }

    modalClose(e, params) {
        this.events.removeClickListener(".modal-button");
        $(".dynamic").remove();
        $(".modal").hide();
        if (params.callback)
            params.callback();
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
