/**
 * Created by David on 5/12/17.
 */

let Quests = {
    "elderSign" : {
        "questText"     : "You have entered these catacombs to find an ancient tablet called the Elder Sign. It's unknown what significance it could have for humanity, but ancient runic writings reference it as having a possible connection to an ancient race called the Elders.",
        "tips"          : "You cannot damage the Elder until you acquire the Elder Sign.",
        "displayedName" : "Elder Sign",
        "goalItem"      : "elder-sign",
        "goalAction"    : "Acquire",
        "goalLocation"  : null
    },
    "killElder" : {
        "questText"     : "You have found an Elder lurking in the depths! You can feel your sanity ebbing, but the monstrosity must be destroyed at all costs to prevent it from creating more hideous Shoggoths and putting an end to mankind!",
        "tips"          : "Your attacks on the Elder will be fruitless unless you possess the Elder Sign.",
        "goalItem"      : "Elder Sign",
        "goalAction"    : "Kill",
        "goalLocation"  : null
    }
};
