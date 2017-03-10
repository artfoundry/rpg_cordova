/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates and updates the game grid of tiles
 */

class Grid {
    constructor(helpers, gridOptions) {
        this.helpers = helpers;
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
        this.tileSize = gridOptions.tileSize;
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
        let $content = $('#' + position + ' .content');

        $content.attr("class", "content content-" + type);
        if (type === 'clear')
            $content.css('opacity', 'initial');
    }

    setImgVisible(position) {
        $('#' + position + ' .content').css('opacity', 1);
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
            $targetLight = $target.children('.light-img'),
            isPlayer = $targetContent.hasClass('content-player'),
            type = params.type,
            callback = params.callback,
            imageRotation = Math.random() * 360,
            grid = this;

        switch (type) {
            case 'move':
                if (params.destinationId) {
                    let destinationPosValues = this.helpers.getRowCol(params.destinationId),
                        currentPosValues = this.helpers.getRowCol(params.position),
                        moveDirection = {
                            vertMov : destinationPosValues.row - currentPosValues.row,
                            horizMov : destinationPosValues.col - currentPosValues.col
                        },
                        movementClasses = '';

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

                            let playerPos = grid.helpers.isOffScreen($targetContent);

                            if (playerPos.top < 140) {
                                window.scrollBy(0, 320);
                            } else if (playerPos.bottom < 140) {
                                window.scrollBy(0, -320);
                            }
                            if (playerPos.left < 140) {
                                window.scrollBy(320, 0);
                            } else if (playerPos.right < 140) {
                                window.scrollBy(-320, 0);
                            }
                        });
                    } else {
                        $targetContent.addClass(movementClasses, function() {
                            $targetContent.removeClass('content-zindex-raised', movementClasses);
                        });
                    }
                }
                break;
            case 'fadeOut':
                $targetContent.animate({opacity: 0}, 200);
                break;
            case 'fadeIn':
                $targetContent.animate({opacity: 1}, 200);
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

    _insertString(baseString, toInsert, position) {
        return baseString.slice(0, position) + toInsert + baseString.slice(position);
    }
}
