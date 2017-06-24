/**
 * Created by David on 5/12/17.
 */

const QUESTS = {
    'elderSign' : {
        'questName'     : "Elder Sign",
        'questText'     : "You have entered these catacombs to find an ancient tablet called the Elder Sign. It's unknown what significance it could have for humanity, but some old runic texts reference it as having a possible connection to an ancient race called the Elders. Find the Elder Sign!",
        'tips'          : "You cannot damage the Elder until you acquire the Elder Sign.",
        'goals'         : {
            'target'    : 'elderSign',
            'action'    : 'Acquire',
            'location'  : null
        },
        'nextQuest'     : 'killElder'
    },
    'killElder' : {
        'questName'     : "Kill the Elder",
        'questText'     : "An Elder is lurking in the depths! You can feel your sanity ebbing, but the monstrosity must be destroyed at all costs to prevent it from creating more hideous Shoggoths and putting an end to mankind!",
        'tips'          : "The Elder has more health than the Shoggoths but doesn't attack. It only spawns a Shoggoth every time it moves.",
        'prereq'        : 'elderSign',
        'goals'         : {
            'target'    : 'Elder',
            'action'    : 'Kill',
            'location'  : null
        },
        'nextQuest'     : null
    }
};
