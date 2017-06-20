/**
 * Created by David on 6/15/17.
 */

let MapOptionsCatacombs = {
    "levels" : [
        {
            "width" : 10,
            "height" : 10,
            "tileSize" : 64,
            "randomization" : 0.4, // determines what type of tile is chosen - lower values = more walls
            "items" : {
                "elderSign": {
                    "itemType": "questItems",
                    "questName": "elderSign",
                    "tileType" : "item",
                    "location": "center",
                    "image": "elder-sign",
                    "func" : null
                },
            },
            "objects" : {
                "stairsUp" : {
                    "itemType" : "stairs",
                    "questName": null,
                    "tileType" : "walkable",
                    "location" : "row1col1",
                    "image" : "stairs-up",
                    "func" : "nextLevel"
                },
                "stairsDown" : {
                    "itemType" : "stairs",
                    "questName": null,
                    "tileType" : "walkable",
                    "location" : "bottom",
                    "image" : "stairs-down",
                    "func" : "nextLevel"
                }
            }
        },
        {
            "width" : 10,
            "height" : 10,
            "tileSize" : 64,
            "randomization" : 0.4, // determines what type of tile is chosen - lower values = more walls
            "objects" : {
                "stairsUp" : {
                    "itemType" : "stairs",
                    "questName": null,
                    "tileType" : "walkable",
                    "location" : "bottom",
                    "image" : "stairs-up",
                    "func" : "nextLevel"
                },
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
        {
            "width" : 10,
            "height" : 10,
            "tileSize" : 64,
            "randomization" : 0.4, // determines what type of tile is chosen - lower values = more walls
            "objects" : {
                "stairsUp" : {
                    "itemType" : "stairs",
                    "questName": null,
                    "tileType" : "walkable",
                    "location" : "right",
                    "image" : "stairs-up",
                    "func" : "nextLevel"
                }
            }
        }
    ],
    "playerOptions" : {
        "player1" : {
            "name" : "Player1",
            "type" : "player",
            "subtype" : "investigator",
            "startPos" : "row1col1",
            "startingLevel" : 0,
            "startingQuest" : "elderSign",
            "health" : 3,
            "sanity" : 20
        }
    },
    "monsterOptions" : {
        "elder1" : {
            "name" : "Elder",
            "type" : "monster",
            "subtype" : "elder",
            "health" : 3,
            "startingLevel" : 2,
            "location" : "center",
            "questGoal" : true,
            "questName" : "killElder"
        }
    }
};
