/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor() {
        this.dialogs = {
            "dialogHeader"  : "Welcome to Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaos denizens wander here.",
            "instructions"  : "You must kill all the creatures to survive and leave with your life! If you are attacked more than three times, you will die.  Good luck!",
            "tips"          : "There are two types of monsters: a Queen, and her minions.  The Queen spawns a minion every turn and must be attacked three times to kill her.  While she cannot attack, her minions can.  Each minion will attack if you approach within one square of it, but can be killed with one hit."
        }
    }

    /**
     * function dialogOpen
     * Unhides the main dialog, displays messages in it, and unhides listed buttons.
     * @param messages: Object with a list of element IDs (referring to the dialog elements) referencing keys of the UI's dialogs Object
     * @param buttons: Array of button IDs to show
     */
    dialogOpen(messages, buttons) {
        $(".dialog").toggle();
        for (let message in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, message)) {
                $(".dialog" > message.element).innerText(message.text);
            }
        }
        for (let i = 0; i < buttons.length; i++) {
            $(".dialog" > buttons[i]).toggle();
        }
    }

    updateValue(id, value) {
        $("#" + id).innerText(value);
    }
}
