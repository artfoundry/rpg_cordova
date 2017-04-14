/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates and updates the game grid of tiles
 */

class Grid {
    constructor(helpers, gridOptions, audio, ui) {
        this.helpers = helpers;
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
        this.gridRandomFactor = gridOptions.randomization;
        this.tileSize = gridOptions.tileSize;
        this.audio = audio;
        this.ui = ui;
    }

    drawGrid() {
        let grid = this,
            $gridEl = $('.grid'),
            gridPixels = (this.gridWidth + 2) * this.tileSize,
            markup = '',
            id = '',
            tileType = '',
            blackGroundTile = '<figure id="" class="tile tile-ground-dungeon walkable"><div class="light-img light-img-trans"></div><div class="content content-trans"></div></figure>',
            borderTile = '<figure id="" class="tile tile-wall impassable"><div class="light-img light-img-trans"></div><div class="content content-trans"></div></figure>';

        $gridEl.prepend(() => {
            for (let rowNum = 0; rowNum <= grid.gridHeight + 1; rowNum++) {
                markup += '<div class="row">';
                for (let colNum = 0; colNum <= grid.gridWidth + 1; colNum++) {
                    id = "row" + rowNum + "col" + colNum;
                    if (rowNum === 0 || rowNum === grid.gridHeight + 1 || colNum === 0 || colNum === grid.gridWidth + 1) {
                        markup += grid._insertString(borderTile, id, borderTile.indexOf('id=') + 4);
                    } else {
                        tileType = this.randomizeTileType(id, markup);
                        if (tileType === 'ground')
                            markup += grid._insertString(blackGroundTile, id, blackGroundTile.indexOf('id=') + 4);
                        else if (tileType === 'wall')
                            markup += grid._insertString(borderTile, id, borderTile.indexOf('id=') + 4);
                    }
                }
                markup += '</div>';
            }
            return markup;
        });
        $gridEl.css('width', gridPixels + 1);
        $('#row0col0').prepend('<canvas id="canvas-lighting" width="' + gridPixels + '" height="' + gridPixels + '"></canvas>');
    }

    randomizeTileType(tileId, markup) {
        let colIndex = tileId.indexOf('col'),
            row = +tileId.slice(3, colIndex),
            col = +tileId.slice(colIndex + 3),
            surroundingTiles = {
                $tileAboveLeft: $(markup).find('#row' + (row - 1) + 'col' + (col - 1)),
                $tileAbove: $(markup).find('#row' + (row - 1) + 'col' + col),
                $tileAboveRight: $(markup).find('#row' + (row - 1) + 'col' + (col + 1)),
                $tileRight: $(markup).find('#row' + row + 'col' + (col + 1)),
                $tileBelowRight: $(markup).find('#row' + (row + 1) + 'col' + (col + 1)),
                $tileBelow: $(markup).find('#row' + (row + 1) + 'col' + col),
                $tileBelowLeft: $(markup).find('#row' + (row + 1) + 'col' + (col - 1)),
                $tileLeft: $(markup).find('#row' + row + 'col' + (col - 1))
            },
            tileType = '';

        if (this.countPreviousWalls(surroundingTiles) > 2) {
            tileType = 'ground';
        // if top and either left or right are walls...
        } else if (surroundingTiles.$tileAbove.hasClass('tile-wall') && (surroundingTiles.$tileLeft.hasClass('tile-wall') || surroundingTiles.$tileRight.hasClass('tile-wall'))) {
            // ...and bottom and right are walls OR left is a wall but top left is not a wall OR right is a wall but top right is not a wall... (basically don't leave catty-corner walls)
            if ((surroundingTiles.$tileRight && surroundingTiles.$tileRight.hasClass('tile-wall') &&
                surroundingTiles.$tileBelow && surroundingTiles.$tileBelow.hasClass('tile-wall')) ||
                (surroundingTiles.$tileLeft.hasClass('tile-wall') && !surroundingTiles.$tileAboveLeft.hasClass('tile-wall')) ||
                (surroundingTiles.$tileRight.hasClass('tile-wall') && !surroundingTiles.$tileAboveRight.hasClass('tile-wall')))
            {
                tileType = 'wall';
            } else {
                tileType = 'ground';
            }
        // otherwise if top, left, and right aren't walls AND top left or top right is a wall
        } else if (!surroundingTiles.$tileAbove.hasClass('tile-wall') && !surroundingTiles.$tileLeft.hasClass('tile-wall') && !surroundingTiles.$tileRight.hasClass('tile-wall') &&
            (surroundingTiles.$tileAboveLeft.hasClass('tile-wall') || surroundingTiles.$tileAboveRight.hasClass('tile-wall'))) {
            tileType = 'ground';

        // otherwise randomize it
        } else {
            tileType = Math.random() >= this.gridRandomFactor ? 'wall' : 'ground';
        }
        return tileType;
    }

    /**
     * function countPreviousWalls
     * Looks at the three tiles above and the tile to the left to see if they're walls.
     * Used to determine if the current tile should be ground or wall when randomizing tiles.
     * @param surroundingTiles:
     */
    countPreviousWalls(surroundingTiles) {
        let wallCount = 0;

        for (let i in surroundingTiles) {
            if (surroundingTiles.hasOwnProperty(i) && surroundingTiles[i].hasClass('tile-wall'))
                wallCount += 1;
        }
        return wallCount;
    }

    clearGrid() {
        $('.grid').children().remove();
    }

    changeTileSetting(position, name, type, subtype) {
        $('#' + position).addClass(name + ' ' + type + ' ' + subtype).removeClass('walkable');
    }

    changeTileImg(position, addClasses, removeClasses) {
        $('#' + position + ' .content').addClass(addClasses).removeClass(removeClasses);
    }

    toggleDirection($targetContent, direction) {
        direction === 'left' ? $targetContent.addClass('face-left').removeClass('face-right') : $targetContent.addClass('face-right').removeClass('face-left');
    }

    setTileWalkable(position, name, type, subtype) {
        $('#' + position).addClass('walkable').removeClass(name + ' ' + type + ' ' + subtype + ' impassable');
    }

    /**
     * animateTile
     * @param params
     * params.position: string of tile ID
     * params.type: string of animation type
     * params.destinationId (only for move type): string of destination tile ID
     * params.callback (optional)
     */
    animateTile(params) {
        let $target = $('#' + params.position),
            $targetContent = $target.children('.content'),
            type = params.type,
            callback = params.callback,
            imageRotation = Math.random() * 360,
            grid = this;

        switch (type) {
            case 'move':
                if (params.destinationId)
                    this._animateMovement(params.position, params.destinationId, callback);
                break;
            case 'fade-in':
                $targetContent.fadeIn();
                break;
            case 'image-swap':
                let delay = params.delay === "death" ? 200 : 0;

                $targetContent.fadeOut(delay, function() {
                    grid.changeTileImg(params.position, params.addClasses, params.removeClasses);
                    $targetContent.fadeIn();
                    if (callback)
                        callback();
                });
                break;
            case 'attack':
                if (params.attacker === 'player')
                    this.audio.playSoundEffect('shotgun');
                $target.prepend("<div class='blood'></div>");
                let $blood = $('.blood');
                $blood
                    .css("transform", "rotate(" + imageRotation + "deg)")
                    .animate({"opacity": 1}, 0)
                    .animate({"opacity": 0}, 300, function() {
                        $blood.detach();
                        callback();
                    });
                break;
            case 'impassable':
                $targetContent
                    .animate({"marginLeft": "+=10"}, 100)
                    .animate({"marginLeft": "-=30"}, 100)
                    .animate({"marginLeft": "+=20"}, 100, function() {
                        $(this).css({"marginLeft": ""});
                    });
                break;
            case 'spawn':
                grid.changeTileImg(params.position, params.addClasses, params.removeClasses);
                $targetContent
                    .css({"backgroundPosition": "32px", "backgroundSize": "0", "opacity": "0"})
                    .animate({"background-position": "-=32px", "backgroundSize": "+=64px", "opacity": "+=1"}, 500, function() {
                        $(this).css({"backgroundPosition": "", "backgroundSize": "", "opacity": ""});
                    });
                break;
        }
    }

    _animateMovement(position, destination, callback) {
        let $target = $('#' + position),
            $targetContent = $target.children('.content'),
            $destinationContent = $('#' + destination).children('.content'),
            destinationPosValues = this.helpers.getRowCol(destination),
            currentPosValues = this.helpers.getRowCol(position),
            moveDirection = {
                vertMov : destinationPosValues.row - currentPosValues.row,
                horizMov : destinationPosValues.col - currentPosValues.col
            },
            movementClasses = '';

        if (moveDirection.vertMov > 0)
            movementClasses = 'move-down';
        else if (moveDirection.vertMov < 0)
            movementClasses = 'move-up';
        if (moveDirection.horizMov > 0) {
            movementClasses = movementClasses === '' ? 'move-right' : movementClasses + ' move-right';
            this.toggleDirection($targetContent);
        }
        else if (moveDirection.horizMov < 0) {
            movementClasses = movementClasses === '' ? 'move-left' : movementClasses + ' move-left';
            this.toggleDirection($targetContent, 'left');
        }
        if ($targetContent.hasClass('face-left'))
            this.toggleDirection($destinationContent, 'left');
        else if ($targetContent.hasClass('face-right'))
            this.toggleDirection($destinationContent);

        // temporarily increase z-index of image for animation, so it doesn't slip under destination tile
        $targetContent.addClass('content-zindex-raised');

        $targetContent.addClass(movementClasses, function() {
            movementClasses += ' content-zindex-raised face-right face-left';
            $targetContent.removeClass(movementClasses);
        });
        $targetContent.promise().done(function() {
            callback();
        });

    }

    _insertString(baseString, toInsert, position) {
        return baseString.slice(0, position) + toInsert + baseString.slice(position);
    }
}
