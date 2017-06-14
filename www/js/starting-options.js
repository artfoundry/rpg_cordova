/**
 * Created by David on 4/5/17.
 */

let StartingOptions = {
    "gridOptions" : {
        "width" : 10,
        "height" : 10,
        "tileSize" : 64,
        "randomization" : 0.4, // determines what type of tile is chosen - lower values = more walls
        "items" : {
            "elderSign": {
                "itemType": "questItems",
                "questName": "elderSign",
                "tileType" : "walkable",
                "location": "bottom",
                "image": "elder-sign",
                "func" : null
            },
        },
        "objects" : {
            "stairsDown" : {
                "itemType" : "stairs",
                "questName": null,
                "tileType" : "walkable",
                "location" : "right",
                "image" : "stairs-down",
                "func" : "nextLevel"
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
            "health" : 3,
            "sanity" : 20
        }
    },
    "monsterOptions" : {
        "monster1" : {
            "name" : "Elder",
            "type" : "monster",
            "subtype" : "elder",
            "health" : 3,
            "location" : "center",
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