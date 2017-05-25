/**
 * Created by David on 4/5/17.
 */

let StartingOptions = {
    "gridOptions" : {
        "width" : 10,
        "height" : 10,
        "tileSize" : 64,
        "randomization" : 0.6, // determines what type of tile is chosen
        "items" : {
            "elder-sign" : {
                "itemType" : "questItems",
                "questName" : "elderSign",
                "location" : "bottom"
            }
        }
    },
    "playerOptions" : {
        "player1" : {
            "name" : "Player1",
            "type" : "player",
            "subtype" : "investigator",
            "startPos" : "row1col1",
            "startingQuest" : "elderSign",
            "health" : 3
        }
    },
    "monsterOptions" : {
        "monster1" : {
            "name" : "Elder",
            "type" : "monster",
            "subtype" : "elder",
            "health" : 3,
            "questGoal" : true,
            "questName" : "killElder"
        }
    },
    "audioOptions" : {
        "musicOn" : "on",
        "soundOn" : "on",
    },
    "uiOptions" : {
        "difficulty" : "medium"
    }
};