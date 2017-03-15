/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates and updates the game grid of tiles
 */

class Grid {
    constructor(helpers, gridOptions, ui) {
        this.helpers = helpers;
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
        this.tileSize = gridOptions.tileSize;
        this.ui = ui;
    }

    drawGrid() {
        let grid = this,
            markup = '',
            id = '',
            blackGroundTile = '<figure id="" class="tile tile-ground-dungeon walkable"><div class="light-img light-img-trans"></div><div class="content content-trans"></div></figure>',
            borderTile = '<figure id="" class="tile tile-wall impassable"><div class="light-img light-img-trans"></div><div class="content content-trans"></div></figure>';

        $('.grid').prepend(() => {
            for (let rowNum = 0; rowNum <= grid.gridHeight + 1; rowNum++) {
                markup += '<div class="row">';
                for (let colNum = 0; colNum <= grid.gridWidth + 1; colNum++) {
                    id = "row" + rowNum + "col" + colNum;
                    if (rowNum === 0 || rowNum === grid.gridHeight + 1 || colNum === 0 || colNum === grid.gridWidth + 1) {
                        markup += grid._insertString(borderTile, id, borderTile.indexOf('id=') + 4);
                    } else {
                        markup += grid._insertString(blackGroundTile, id, blackGroundTile.indexOf('id=') + 4);
                    }
                }
                markup += '</div>';
            }
            $('.grid').css('width', (this.gridWidth + 2) * this.tileSize);
            return markup;
        });
    }

    clearGrid() {
        $('.grid').children().remove();
    }

    changeTileSetting(position, name, type) {
        $('#' + position).addClass(name + ' ' + type).removeClass('walkable');
    }

    changeTileImg(position, type) {
        $('#' + position + ' .content').attr("class", "content content-" + type);
    }

    setTileWalkable(position, name, type) {
        $('#' + position).addClass('walkable').removeClass(name + ' ' + type + ' impassable');
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
                    this._animateMovement(params.position, params.destinationId);
                break;
            case 'fade-out':
                $targetContent.fadeOut();
                break;
            case 'fade-in':
                $targetContent.fadeIn();
                break;
            case 'spawn':
                $targetContent.fadeOut(function() {
                    grid.changeTileImg(params.position, params.characterType);
                    $targetContent.fadeIn();
                });
                break;
            case 'attack':
                $target.prepend("<div class='blood'></div>");
                $(".blood")
                    .css("transform", "rotate(" + imageRotation + "deg)")
                    .animate({opacity: 1}, 0)
                    .animate({opacity: 0.8}, 100)
                    .animate({opacity: 0}, 300, function() {
                        $(".blood").remove();
                    });
                break;
            case 'impassable':
                $targetContent
                    .animate({marginLeft: "+=10"}, 100)
                    .animate({marginLeft: "-=30"}, 100)
                    .animate({marginLeft: "+=20"}, 100);
                break;
        }
        if (callback) {
            $targetContent.promise().done(function() {
                callback();
            });
        }
    }

    _animateMovement(position, destination) {
        let $target = $('#' + position),
            $targetContent = $target.children('.content'),
            $targetLight = $target.children('.light-img'),
            isPlayer = $targetContent.hasClass('content-player'),
            destinationPosValues = this.helpers.getRowCol(destination),
            currentPosValues = this.helpers.getRowCol(position),
            moveDirection = {
                vertMov : destinationPosValues.row - currentPosValues.row,
                horizMov : destinationPosValues.col - currentPosValues.col
            },
            movementClasses = '',
            grid = this;

        if (moveDirection.vertMov > 0)
            movementClasses = 'move-down';
        else if (moveDirection.vertMov < 0)
            movementClasses = 'move-up';
        if (moveDirection.horizMov > 0)
            movementClasses = movementClasses === '' ? 'move-right' : movementClasses + ' move-right';
        else if (moveDirection.horizMov < 0)
            movementClasses = movementClasses === '' ? 'move-left' : movementClasses + ' move-left';

        $targetLight.push($targetContent);
        $targetContent.addClass('content-zindex-raised');
        if (isPlayer) {
            $targetLight.each(function(){
                $(this).addClass(movementClasses, function() {
                    $targetLight.each(function() {
                        $(this).removeClass(movementClasses);
                    });
                    $targetContent.removeClass('content-zindex-raised');
                });

                let playerPos = grid.helpers.isOffScreen($targetContent),
                    x = 0,
                    y = 0;

                // if player is near the bottom and moving down
                if (movementClasses.includes('move-down') && playerPos.top > 0 && playerPos.top < 140) {
                    y = $(window).height() / 3;
                // if player is near the top and moving up
                } else if (movementClasses.includes('move-up') && playerPos.bottom > 0 && playerPos.bottom < 140) {
                    y = -$(window).height() / 3;
                }
                // if player is near the left edge and moving left
                if (movementClasses.includes('move-right') && playerPos.left > 0 && playerPos.left < 140) {
                    x = $(window).width() / 3;
                // if player is near the right edge and moving right
                } else if (movementClasses.includes('move-left') && playerPos.right > 0 && playerPos.right < 140) {
                    x = -$(window).width() / 3;
                }
                grid.ui.scrollWindow(x, y);
            });
        } else {
            $targetContent.addClass(movementClasses, function() {
                $targetContent.removeClass('content-zindex-raised', movementClasses);
            });
        }
    }

    _insertString(baseString, toInsert, position) {
        return baseString.slice(0, position) + toInsert + baseString.slice(position);
    }
}
