var app = {
    initialize: function() {
        var grid = new Grid();
        var player = new Player();
        var gridOptions = {
            width: 10,
            height: 10
        };
        grid.initialize(gridOptions);
        setUpTileChangeListener('.tile', grid.updateTileImage);
        player.initialize(gridOptions);
        setUpClickListener('.tile', player.movePlayer);
    }
};

function Player() {
    var self = this;

    this.initialize = function(gridOptions) {
        this.gridWidth = gridOptions.width;
        self.topTile = function(center) { return center - self.gridWidth; };
        self.bottomTile = function(center) { return center + self.gridWidth; };
        self.leftTile = function(center) { if (center % self.gridWidth === 1) return 0; else return center - 1; };
        self.rightTile = function(center) { if (center % self.gridWidth === 0) return 0; else return center + 1; };
        self.tlTile = function(center) { if (center % self.gridWidth === 1) return 0; else return center - self.gridWidth - 1; };
        self.trTile = function(center) { if (center % self.gridWidth === 0) return 0; else return center - self.gridWidth + 1; };
        self.blTile = function(center) { if (center % self.gridWidth === 1) return 0; else return center + self.gridWidth - 1; };
        self.brTile = function(center) { if (center % self.gridWidth === 0) return 0; else return center + self.gridWidth + 1; };

        self.playerPos = 1;
        this._setPlayer(self.playerPos);
        this.setFog();
    };

    this._setPlayer = function(tileNumber) {
        $('#tile-' + tileNumber).addClass('player').trigger('classChange', ['.player', '<img src="img/character-color.png">']);
    };

    this.setFog = function(newTile) {
        var surroundingPreviousTiles = $('#tile-' + (self.topTile(self.playerPos)))
            .add($('#tile-' + (self.bottomTile(self.playerPos))))
            .add($('#tile-' + (self.leftTile(self.playerPos))))
            .add($('#tile-' + (self.rightTile(self.playerPos))))
            .add($('#tile-' + (self.tlTile(self.playerPos))))
            .add($('#tile-' + (self.trTile(self.playerPos))))
            .add($('#tile-' + (self.blTile(self.playerPos))))
            .add($('#tile-' + (self.brTile(self.playerPos))));
        var surroundingNewTiles = $('#tile-' + (self.topTile(newTile)))
            .add($('#tile-' + (self.bottomTile(newTile))))
            .add($('#tile-' + (self.leftTile(newTile))))
            .add($('#tile-' + (self.rightTile(newTile))))
            .add($('#tile-' + (self.trTile(newTile))))
            .add($('#tile-' + (self.tlTile(newTile))))
            .add($('#tile-' + (self.brTile(newTile))))
            .add($('#tile-' + (self.blTile(newTile))));

        if (newTile) {
            surroundingPreviousTiles.removeClass('lightFog').addClass('darkestFog').trigger('classChange', ['.darkestFog', '<img src="img/black.png">']);  // this seems to be getting completed last instead of first
            surroundingNewTiles.addClass('lightFog').trigger('classChange', ['.lightFog', '<img src="img/fog.png">']);
        } else {
            surroundingPreviousTiles.addClass('lightFog').trigger('classChange', ['.lightFog', '<img src="img/fog.png">']);
        }
    };

    this.movePlayer = function(newTile) {
        var newTileIndex = newTile.id.indexOf('e') + 2,
            newTilePos = +newTile.id.slice(newTileIndex);
        if ((newTilePos === (self.rightTile(self.playerPos))) ||
            (newTilePos === (self.leftTile(self.playerPos))) ||
            (newTilePos === (self.bottomTile(self.playerPos))) ||
            (newTilePos === (self.topTile(self.playerPos))) ||
            (newTilePos === (self.trTile(self.playerPos))) ||
            (newTilePos === (self.tlTile(self.playerPos))) ||
            (newTilePos === (self.brTile(self.playerPos))) ||
            (newTilePos === (self.blTile(self.playerPos)))
        ) {
            self.setFog(newTilePos);
            $('#tile-' + self.playerPos).removeClass('player');
            self._setPlayer(newTilePos);
            self.playerPos = newTilePos;
        }
    };
}

function Grid() {
    this.initialize = function(gridOptions) {
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
        this.drawGrid();
    };

    this.drawGrid = function() {
        var self = this;
        $('.grid').prepend(function(){
            var markup = '';
            for(var r=1; r <= self.gridHeight; r++) {
                markup += '<div id="row-' + r + '" class="row">';
                var cellNum;
                for(var c=1; c <= self.gridWidth; c++) {
                    cellNum = ((r - 1) * self.gridWidth) + c;
                    markup += '<figure id="tile-' + cellNum + '" class="tile darkestFog"><img src="img/black.png"></figure>'
                }
                markup += '</div>';
            }
            return markup;
        });
    };

    this.updateTileImage = function(e, tileClass, image) {
        $(tileClass + '>img').replaceWith(image);
    };
}

function setUpClickListener(target, callback) {
    $(target).click(function(e) { callback(e.currentTarget); });
}

function setUpTileChangeListener(target, callback) {
    $(target).on('classChange', function(e, tileClass, image) { callback(e, tileClass, image); })
}

$(app.initialize());
