/**
 * Created by David on 1/18/17.
 */

class UI {
    constructor() {
        this.dialogs = {
            "dialogHeader"  : "Welcome to Monsters!",
            "gameIntro"     : "You have entered a dark crypt in search of a valuable artifact, but little did you know that ancient evil and chaotic denizens wander here.",
            "instructions"  : "You must kill all the creatures to survive and leave with your life! If you are attacked more than three times, you will die.  Good luck!",
            "tips"          : "There are two types of monsters: a Queen, and her minions.  The Queen spawns a minion every turn and must be attacked three times to kill her.  While she cannot attack, her minions can.  Each minion will attack if you approach within one square of it, but can be killed with one hit.",
            "gameOverDead"  : "The hideous monster sucks the life out of you.  You are dead.",
            "gameOverWin"   : "You've finally slaughtered every last creature and make it out alive!"
        };
        this.kills = 0;

        //temp
        let self = this;
        $("#open-modal").click(function() {
            self.kills += 1;
            self.modalOpen([
                {"element" : ".dialog-body", "text" : "gameIntro"},
                {"element" : "#dialog-header", "text" : "dialogHeader"}], [
                {"id" : "#button-start", "action" : self.modalClose},
                {"id" : "#button-restart", "action" : self.updateValue, "params" : {"id" : "#pc-health .status-value", "value" : 1}},
                {"id" : "#button-tips", "action" : self.updateValue, "params" : {"id" : "#pc-health .status-value", "value" : -1}}]
            );
        });
    }

    /**
     * function dialogOpen
     * Unhides the main dialog, displays messages in it, and unhides listed buttons.
     * @param messages: Object with a list of element IDs (referring to the dialog elements) referencing keys of the UI's dialogs Object
     * @param buttons: Array of button IDs to show
     */
    modalOpen(messages, buttons) {
        $(".modal").show();
        for (let i = 0; i < messages.length; i++) {
            $(".modal " + messages[i].element).text(this.dialogs[messages[i].text]);
        }
        for (let i = 0; i < buttons.length; i++) {
            $(".modal " + buttons[i].id).show().click(function() {
                if (buttons[i].params)
                    buttons[i].action(buttons[i].params);
                else
                    buttons[i].action();
            });
        }
    }

    modalClose() {
        $(".modal").hide();
        $(".modal button").hide();
    }

    updateValue(params) {
        let $element = $(params.id),
            $bubble = $(params.id + " .life-bubble:last"),
            newBubble = "<span class='life-bubble'></span>";

        if (params.id.includes("#pc-health")) {
            params.value < 0 ? $bubble.remove() : $element.append(newBubble);
        }
        else
            $element.text(params.value);
    }
}
