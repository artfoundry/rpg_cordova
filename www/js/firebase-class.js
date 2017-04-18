/**
 * Created by David on 4/17/17.
 */

class FirebaseServices {
    constructor() {
        this.config = {
            apiKey: "AIzaSyC5sUa2U_VhSpnN7E6SzJGg8LrF6O4d84U",
            authDomain: "monsters-330fe.firebaseapp.com",
            databaseURL: "https://monsters-330fe.firebaseio.com",
            projectId: "monsters-330fe",
            storageBucket: "monsters-330fe.appspot.com",
            messagingSenderId: "569925957074"
        };
        this.initialize();
        this.fbDatabase = firebase.database();
    }

    initialize() {
        firebase.initializeApp(this.config);
    }

    saveScore(score) {
        this.fbDatabase.ref('scores/' + Game.gameSettings.difficulty).push({
            score: score
        });
    }

    getScores(callback) {
        let scores = this.fbDatabase.ref('/scores/').orderByChild('score').once('value', function(snapshot) {
            let scores = {
                "easy" : [],
                "medium" : [],
                "hard" : []
            };
            snapshot.forEach(function(difficulty) {
                difficulty.forEach(function(childSnapshot) {
                    scores[difficulty.key].push(childSnapshot.val().score);
                });
            });
            callback(scores);
        });
    }
}