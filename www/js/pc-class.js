/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * private
 * - setting character position
 * - determining values of tiles surrounding character
 * - drawing fog around characters
 *
 * public
 * - moving
 */

class PlayerCharacter {
    constructor(gridOptions) {
        this.gridWidth = gridOptions.width;
        this.playerPos = gridOptions.playerStart;
    }

    initialize() {
        this._setPlayer(this.playerPos);
        this._setFog();
    }

    topTile(center) { return center - this.gridWidth; }
    bottomTile(center) { return center + this.gridWidth; }
    leftTile(center) { if (center % this.gridWidth === 1) return 0; else return center - 1; }
    rightTile(center) { if (center % this.gridWidth === 0) return 0; else return center + 1; }
    tlTile(center) { if (center % this.gridWidth === 1) return 0; else return center - this.gridWidth - 1; }
    trTile(center) { if (center % this.gridWidth === 0) return 0; else return center - this.gridWidth + 1; }
    blTile(center) { if (center % this.gridWidth === 1) return 0; else return center + this.gridWidth - 1; }
    brTile(center) { if (center % this.gridWidth === 0) return 0; else return center + this.gridWidth + 1; }

    _setPlayer(tileNumber) {
        $('#tile-' + tileNumber).addClass('player').trigger('classChange', ['.player', '<img src="img/character-color.png">']);
    };

    _setFog(newTile) {
        let surroundingPreviousTiles = $('#tile-' + (this.topTile(this.playerPos)))
            .add($('#tile-' + (this.bottomTile(this.playerPos))))
            .add($('#tile-' + (this.leftTile(this.playerPos))))
            .add($('#tile-' + (this.rightTile(this.playerPos))))
            .add($('#tile-' + (this.tlTile(this.playerPos))))
            .add($('#tile-' + (this.trTile(this.playerPos))))
            .add($('#tile-' + (this.blTile(this.playerPos))))
            .add($('#tile-' + (this.brTile(this.playerPos))));
        let surroundingNewTiles = $('#tile-' + (this.topTile(newTile)))
            .add($('#tile-' + (this.bottomTile(newTile))))
            .add($('#tile-' + (this.leftTile(newTile))))
            .add($('#tile-' + (this.rightTile(newTile))))
            .add($('#tile-' + (this.trTile(newTile))))
            .add($('#tile-' + (this.tlTile(newTile))))
            .add($('#tile-' + (this.brTile(newTile))))
            .add($('#tile-' + (this.blTile(newTile))));

        if (newTile) {
            surroundingPreviousTiles.removeClass('lightFog').addClass('darkestFog').trigger('classChange', ['.darkestFog', '<img src="img/black.png">']);
            surroundingNewTiles.addClass('lightFog').trigger('classChange', ['.lightFog', '<img src="img/fog.png">']);
        } else {
            surroundingPreviousTiles.addClass('lightFog').trigger('classChange', ['.lightFog', '<img src="img/fog.png">']);
        }
    };

    movePlayer(newTile, player) {
        let newTileIndex = newTile.id.indexOf('e') + 2,
            newTilePos = +newTile.id.slice(newTileIndex);

        if ((newTilePos === (player.rightTile(player.playerPos))) ||
            (newTilePos === (player.leftTile(player.playerPos))) ||
            (newTilePos === (player.bottomTile(player.playerPos))) ||
            (newTilePos === (player.topTile(player.playerPos))) ||
            (newTilePos === (player.trTile(player.playerPos))) ||
            (newTilePos === (player.tlTile(player.playerPos))) ||
            (newTilePos === (player.brTile(player.playerPos))) ||
            (newTilePos === (player.blTile(player.playerPos)))
        ) {
            player._setFog(newTilePos);
            $('#tile-' + player.playerPos).removeClass('player');
            player._setPlayer(newTilePos);
            player.playerPos = newTilePos;
        }
    };
}
