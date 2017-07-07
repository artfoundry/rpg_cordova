/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates and updates the game grid of tiles
 */

class Grid {
    constructor(dungeon, gridOptions, audio) {
        this.dungeon = dungeon;
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
        this.gridRandomFactor = gridOptions.randomization;
        this.tileSize = gridOptions.tileSize;
        this.audio = audio;
    }

    /**
     * function drawGrid
     * @param level: jQuery object of previously created level (all levels stored in dungeon)
     * @param items: object of items from StartingOptions.gridOptions.items
     * @param objects: object of objects from StartingOptions.gridOptions.items
     */
    drawGrid(level, items, objects) {
        let grid = this,
            $gridEl = $('.grid'),
            gridPixels = (this.gridWidth + 2) * this.tileSize,
            markup = '',
            id = '',
            tileType = '',
            walkableTile = '<figure id="" class="tile tile-ground-dungeon walkable"><div class="light-img light-img-trans"></div><div class="character"></div><div class="content"></div></figure>',
            borderTile = '<figure id="" class="tile tile-wall impassable"><div class="light-img light-img-trans"></div><div class="content"></div></figure>';

        if (level) {
            $gridEl.prepend(level);
        } else {
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
                                markup += grid._insertString(walkableTile, id, walkableTile.indexOf('id=') + 4);
                            else if (tileType === 'wall')
                                markup += grid._insertString(borderTile, id, borderTile.indexOf('id=') + 4);
                        }
                    }
                    markup += '</div>';
                }
                return markup;
            });
            this.addItems(items, objects);
            $gridEl.css('width', gridPixels + 1);
            $('#row0col0').prepend('<canvas id="canvas-lighting" width="' + gridPixels + '" height="' + gridPixels + '"></canvas>');
        }
    }

    randomizeTileType(tileId, markup) {
        let colIndex = tileId.indexOf('col'),
            row = +tileId.slice(3, colIndex),
            col = +tileId.slice(colIndex + 3),
            surroundingTiles = {
                $tileAboveLeft : $(markup).find('#row' + (row - 1) + 'col' + (col - 1)),
                $tileAbove : $(markup).find('#row' + (row - 1) + 'col' + col),
                $tileAboveRight : $(markup).find('#row' + (row - 1) + 'col' + (col + 1)),
                $tileLeft : $(markup).find('#row' + row + 'col' + (col - 1))
            },
            previousWallCount = this.countPreviousWalls(surroundingTiles),
            tileType = '';

        // if topleft is not a wall but left and top are
        if (!surroundingTiles.$tileAboveLeft.hasClass('tile-wall') && surroundingTiles.$tileLeft.hasClass('tile-wall') && surroundingTiles.$tileAbove.hasClass('tile-wall')) {
            tileType = 'wall';
        // or if top isn't a wall but either topleft is and left is not or both topright and left are
        } else if (!surroundingTiles.$tileAbove.hasClass('tile-wall') &&
            ((surroundingTiles.$tileAboveLeft.hasClass('tile-wall') && !surroundingTiles.$tileLeft.hasClass('tile-wall')) ||
            (surroundingTiles.$tileAboveRight.hasClass('tile-wall') && surroundingTiles.$tileLeft.hasClass('tile-wall')))
        ) {
            tileType = 'ground';
        // if too many walls around
        } else if (previousWallCount >= 3 || (previousWallCount >= 1 && row === 10)) {
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
     * @param surroundingTiles: object of jquery elements
     */
    countPreviousWalls(surroundingTiles) {
        let wallCount = 0;

        for (let el in surroundingTiles) {
            if (surroundingTiles.hasOwnProperty(el) && surroundingTiles[el].hasClass('tile-wall'))
                wallCount += 1;
        }
        return wallCount;
    }

    /**
     * function addItems
     * Adds all passed items into randomly chosen walkable tiles
     * @param items: object of items from StartingOptions.gridOptions.items
     * @param objects: object of objects from StartingOptions.gridOptions.items
     */
    addItems(items, objects) {
        if (items) {
            for (let item in items) {
                if (items.hasOwnProperty(item)) {
                    let itemLoc = '';

                    if (items[item].location.includes('row'))
                        itemLoc = items[item].location;
                    else
                        itemLoc = Game.helpers.randomizeLoc(items[item].location, this.gridWidth, this.gridHeight);
                    this.changeTileSetting(itemLoc, item, 'item', items[item].itemType, items[item].questName, items[item].tileType, items[item].func);
                    this.changeTileImg(itemLoc, '.content', 'content-' + items[item].image);
                }
            }
        }
        if (objects) {
            for (let object in objects) {
                if (objects.hasOwnProperty(object)) {
                    let objectLoc = '';

                    if (objects[object].location.includes('row'))
                        objectLoc = objects[object].location;
                    else
                        objectLoc = Game.helpers.randomizeLoc(objects[object].location, this.gridWidth, this.gridHeight);
                    this.changeTileSetting(objectLoc, object, 'object', objects[object].itemType, objects[object].questName, objects[object].tileType, objects[object].func, objects[object].message);
                    this.changeTileImg(objectLoc, '.content', 'content-' + objects[object].image);
                }
            }
        }
    }

    labelPCAdjacentTiles(position) {
        let $adjacentTiles = Game.helpers.findSurroundingTiles(this.gridWidth, this.gridHeight, position, 1);

        $('.tile').removeClass('pc-adjacent');
        $adjacentTiles.addClass('pc-adjacent');
    }

    /**
     * function changeTileSetting
     * Changes tile classes to indicate the type of tile (walkable, impassable, item, object, player, monster, etc.).
     * Also adds data information for item info, quest name, and function
     * @param position - string of tile ID
     * @param name - string of object/item/character name (Elder, Shoggoth, Elder Sign, etc.)
     * @param type - string of object/item/character type (player, monster, stairs, etc.)
     * @param subtype - string of object/item/character subtype (investigator, elder, stairsUp, etc.)
     * @param questName - string of quest tied to item/object
     * @param tileType - string of type of tile (walkable, impassable, item)
     * @param func - string of callback to fire - options are 'nextLevel', 'displayStatus'
     * @param message - string of key for message to display if func is 'displayStatus'
     */
    changeTileSetting(position, name, type, subtype, questName = null, tileType = null, func = null, message = null) {
        let $position = $('#' + position);

        $position.addClass(name + ' ' + type + ' ' + subtype);
        if (tileType !== 'walkable')
            $position.removeClass('walkable');
        if (tileType === 'item')
            $position.attr('data-item-type', subtype).attr('data-item-name', name);
        if (questName)
            $position.attr('data-quest-name', questName);
        if (func) {
            $position.attr('data-function', func);
            if (message) {
                $position.attr('data-message', message);
            }
        }
    }

    changeTileImg(position, tileLayer, addClasses, removeClasses = null) {
        $('#' + position + ' ' + tileLayer).addClass(addClasses).removeClass(removeClasses);
    }

    toggleDirection($targetContent, direction) {
        direction === 'left' ? $targetContent.addClass('face-left').removeClass('face-right') : $targetContent.addClass('face-right').removeClass('face-left');
    }

    setTileWalkable(position, name, type, subtype) {
        let $position = $('#' + position);

        $position.addClass('walkable').removeClass(name + ' ' + type + ' ' + subtype + ' impassable');
        if ($position.attr('data-item-type'))
            $position.attr('data-item-type', null).attr('data-item-name', null);
        if ($position.attr('data-quest-name'))
            $position.attr('data-quest-name', null);
    }

    setLighting(newPos, currentPos, lightRadius) {
        let oldPos = currentPos || newPos,
            newLightPos = $('#' + newPos).offset(),
            currentLightPos = $('#' + oldPos + ' .character').offset(),
            lightingParams = {},
            grid = this;

        lightingParams.gridPos = $('.grid').offset();
        lightingParams.radius = lightRadius * grid.tileSize + (grid.tileSize/2);
        lightingParams.newLightPosTop = Math.round(newLightPos.top - lightingParams.gridPos.top - (lightingParams.radius/3));
        lightingParams.newLightPosLeft = Math.round(newLightPos.left - lightingParams.gridPos.left + (lightingParams.radius/6));
        lightingParams.currentLightPosLeft = this._calcCurrentPosition(currentLightPos, lightingParams.gridPos, lightingParams.radius).left;
        lightingParams.currentLightPosTop = this._calcCurrentPosition(currentLightPos, lightingParams.gridPos, lightingParams.radius).top;
        lightingParams.canvas = document.getElementById("canvas-lighting");
        lightingParams.currentPos = currentPos;

        this._drawLightCircle(lightingParams);

        if (newPos !== oldPos) {
            let lightingLoop = function() {
                lightingParams.animID = requestAnimationFrame(lightingLoop);
                grid._drawLightCircle(lightingParams);
            };
            lightingLoop();
        }
    }

    _drawLightCircle(lightingParams) {
        let canvas = lightingParams.canvas,
            radius = lightingParams.radius,
            cx = lightingParams.currentLightPosLeft,
            cy = lightingParams.currentLightPosTop,
            ctx = canvas.getContext('2d'),
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

        if (lightingParams.animID) {
            let $charPos = $('#' + lightingParams.currentPos + ' .character'),
                currentLightPos = $charPos.offset();

            lightingParams.currentLightPosLeft = this._calcCurrentPosition(currentLightPos, lightingParams.gridPos, lightingParams.radius).left;
            lightingParams.currentLightPosTop = this._calcCurrentPosition(currentLightPos, lightingParams.gridPos, lightingParams.radius).top;
            if (lightingParams.newLightPosLeft === lightingParams.currentLightPosLeft && lightingParams.newLightPosTop === lightingParams.currentLightPosTop)
                cancelAnimationFrame(lightingParams.animID);
        }
    }

    _calcCurrentPosition(currentLightPos, gridPos, radius) {
        let position = {};

        position.left = Math.round(currentLightPos.left - gridPos.left + (radius/6));
        position.top = Math.round(currentLightPos.top - gridPos.top - (radius/3));
        return position;
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
            $targetContent = $target.children(params.tileLayer),
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
                let delay = params.delay === 'death' ? 200 : 0;

                $targetContent.fadeOut(delay, function() {
                    grid.changeTileImg(params.position, params.tileLayer, params.addClasses, params.removeClasses);
                    $targetContent.fadeIn();
                    if (callback)
                        callback();
                });
                break;
            case 'attack':
                let $blood;
                if (params.attacker === 'player') {
                    this.audio.playSoundEffect(['shotgun']);
                    $target.prepend("<div class='blood-monster'></div>");
                    $blood = $('.blood-monster');
                } else {
                    this.audio.playSoundEffect(['attack-shoggoth-01', 'attack-shoggoth-02', 'attack-shoggoth-03']);
                    $target.prepend("<div class='blood-human'></div>");
                    $blood = $('.blood-human');
                }
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
                grid.changeTileImg(params.position, params.tileLayer, params.addClasses, params.removeClasses);
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
            $targetContent = $target.children('.character'),
            $destinationContent = $('#' + destination).children('.character'),
            destinationPosValues = Game.helpers.getRowCol(destination),
            currentPosValues = Game.helpers.getRowCol(position),
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
        $targetContent.addClass('character-zindex-raised');

        $targetContent.addClass(movementClasses, function() {
            movementClasses += ' character-zindex-raised face-right face-left';
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
