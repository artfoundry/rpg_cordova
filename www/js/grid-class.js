/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates and updates the game grid of tiles
 */

class Grid {
    constructor(gridOptions) {
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
    }

    drawGrid() {
        let grid = this,
            markup = '',
            id = '',
            blackGroundTile = '<figure id="" class="tile tile-ground-dungeon walkable light-non"><div class="light-img light-img-non"></div><img class="content" src="img/trans.png"></figure>',
            borderTile = '<figure id="" class="tile tile-wall impassable light-non"><div class="light-img light-img-non"></div><img class="content" src="img/trans.png"></figure>';

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
            return markup;
        });
    }

    clearGrid() {
        $('.grid').children().remove();
    }

    clearImg(target) {
        let targetType = '';
        if (target.constructor === PlayerCharacter)
            targetType = 'player';
        else
            targetType = 'monster';

        $('#' + target.pos)
            .addClass('walkable')
            .trigger('tileChange', [target.name, '<img class="content" src="img/trans.png">'])
            .removeClass(target.name + ' ' + targetType);
    }

    updateTileImage(e, tileClass, image) {
        $('.' + tileClass + '>img.content').replaceWith(image);
    }

    animateTile(e, params) {
        let $target = $('#' + params.targetObject.pos),
            $targetContent = $target.children('.content'),
            type = params.type,
            callback = params.callback,
            rotation = Math.random() * 360;

        switch (type) {
            case 'attack':
                $target.prepend("<div class='blood'></div>");
                $(".blood")
                    .css("transform", "rotate(" + rotation + "deg)")
                    .animate({opacity: 1}, 100)
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
