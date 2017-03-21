/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * - setting character position
 * - drawing lighting around characters
 */

class PlayerCharacter {
    constructor(playerOptions, grid, helpers) {
        this.grid = grid;
        this.helpers = helpers;
        this.pos = playerOptions.startPos;
        this.name = playerOptions.name;
        this.type = playerOptions.type;
        this.subtype = playerOptions.subtype;
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.lightRadius = 2; // not needed unless we implement changeable light radii
        this.kills = 0;
        this.lightingParams = {};
        // radius x = 2x + 1 sqs
        // 0 = 1x1 sqs
        // 1 = 3x3 sqs
        // 2 = 5x5 sqs
        // 3 = 7x7 sqs
    }

    initialize() {
        this.setPlayer(this.pos);
        this._setLighting(this.pos);
        this.resetKills();
    }

    resetKills() {
        this.kills = 0;
    }

    updateKills() {
        this.kills += 1;
    }

    getKills() {
        return this.kills;
    }

    setPlayer(currentPos, newPos, callback) {
        let player = this,
            newPosId = newPos || currentPos,
            animateMoveParams = {
                "position" : currentPos,
                "destinationId" : newPosId,
                "type" : "move",
                "callback" : function() {
                    player.grid.changeTileImg(newPosId, player.type);
                    player.grid.changeTileImg(currentPos, "trans");
                    if (callback)
                        callback();
                }
            };

        if (currentPos !== newPosId) {
            player.grid.setTileWalkable(currentPos, player.name, player.type, player.subtype);
            player.grid.changeTileSetting(newPosId, player.name, player.type, player.subtype);
            player.grid.animateTile(animateMoveParams);
            player._setLighting(newPosId, currentPos);
            player.pos = newPosId;
        } else {
            player.grid.changeTileImg(newPosId, player.type);
            player.grid.changeTileSetting(newPosId, player.name, player.type, player.subtype);
        }

        player.row = this.helpers.getRowCol(newPosId).row;
        player.col = this.helpers.getRowCol(newPosId).col;
    }

    _setLighting(newPos, currentPos) {
        let oldPos = currentPos || newPos,
            newLightPos = $('#' + newPos).offset(),
            currentLightPos = $('#' + oldPos + ' .content').offset(),
            player = this;

        this.lightingParams.gridPos = $('.grid').offset();
        this.lightingParams.radius = this.lightRadius * this.grid.tileSize + (this.grid.tileSize/2);
        this.lightingParams.newLightPosTop = Math.round(newLightPos.top - this.lightingParams.gridPos.top - (this.lightingParams.radius/3));
        this.lightingParams.newLightPosLeft = Math.round(newLightPos.left - this.lightingParams.gridPos.left + (this.lightingParams.radius/3));
        this._calcCurrentPosition(currentLightPos);
        this.lightingParams.canvas = document.getElementById("canvas-lighting");
        this.lightingParams.currentPos = currentPos;

        this._drawLightCircle();

        if (newPos !== oldPos) {
            let lightingLoop = function() {
                player.lightingParams.animID = requestAnimationFrame(lightingLoop);
                player._drawLightCircle();
            };
            lightingLoop();
        }
    }

    _drawLightCircle() {
        let canvas = this.lightingParams.canvas,
            radius = this.lightingParams.radius,
            cx = this.lightingParams.currentLightPosLeft,
            cy = this.lightingParams.currentLightPosTop,
            ctx = canvas.getContext("2d"),
            cw = canvas.width,
            ch = canvas.height,
            radialGradient = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);

        ctx.save();
        ctx.clearRect(0, 0, cw, ch);
        radialGradient.addColorStop(0, 'rgba(0,0,0,1)');
        radialGradient.addColorStop(.65, 'rgba(0,0,0,1)');
        radialGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI*2);
        ctx.fillStyle = radialGradient;
        ctx.fill();
        ctx.globalCompositeOperation = 'source-out';
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cw, ch);
        ctx.restore();

        if (this.lightingParams.animID) {
            let $charPos = $('#' + this.lightingParams.currentPos + ' .content'),
                currentLightPos = $charPos.offset();

            this._calcCurrentPosition(currentLightPos);
            if (this.lightingParams.newLightPosLeft === this.lightingParams.currentLightPosLeft && this.lightingParams.newLightPosTop === this.lightingParams.currentLightPosTop)
                cancelAnimationFrame(this.lightingParams.animID);
        }
    }

    _calcCurrentPosition(currentPos) {
        this.lightingParams.currentLightPosLeft = Math.round(currentPos.left - this.lightingParams.gridPos.left + (this.lightingParams.radius/3));
        this.lightingParams.currentLightPosTop = Math.round(currentPos.top - this.lightingParams.gridPos.top - (this.lightingParams.radius/3));
    }
}
