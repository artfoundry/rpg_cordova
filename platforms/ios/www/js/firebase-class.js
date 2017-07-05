/**
 * Created by David on 4/17/17.
 */

class FirebaseServices {
    constructor() {
        this.isOnline = this._initialize();
        if (this.isOnline) {
            this.fbDatabase = firebase.database();
            this.scores = {
                "easy": [],
                "medium": [],
                "hard": []
            };
            this._getScores();
        }
    }

    _initialize() {
        let config = {
            apiKey: "AIzaSyC5sUa2U_VhSpnN7E6SzJGg8LrF6O4d84U",
            authDomain: "monsters-330fe.firebaseapp.com",
            databaseURL: "https://monsters-330fe.firebaseio.com",
            projectId: "monsters-330fe",
            storageBucket: "monsters-330fe.appspot.com",
            messagingSenderId: "569925957074"
        },
        initResult = true;

        try {
            firebase.initializeApp(config);
        } catch (e) {
            alert(e + ' Unable to connect to the server. Reload the game to try again.');
            initResult = false;
        }
        return initResult;
    }

    saveScore(score, callback) {
        if (this.isOnline) {
            this.fbDatabase.ref('scores/' + Game.gameSettings.difficulty).push({
                score: score
            });
            callback();
        }
    }

    _getScores() {
        let newScores,
            fbServices = this;

        if (this.isOnline) {
            for (let list in this.scores) {
                if (this.scores.hasOwnProperty(list)) {
                    this.fbDatabase.ref('/scores/' + list).orderByChild('score').limitToLast(10).on('value', function(snapshot) {
                        newScores = [];
                        snapshot.forEach(function(childSnapshot) {
                            newScores.push(childSnapshot.val().score);
                        });
                        fbServices.scores[list] = newScores;
                    });
                    this.scores[list].reverse();
                }
            }
        }
    }
}